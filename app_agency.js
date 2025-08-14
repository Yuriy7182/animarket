
import {
  db, auth, onAuthStateChanged,
  doc, getDoc, collection, addDoc, getDocs, query, orderBy, serverTimestamp, mountAuthLink
} from "./firebase.js";

let currentAgency = null;
const params = new URLSearchParams(window.location.search);
const id = params.get("id") || localStorage.getItem("selectedAgencyId");

const titleEl = document.getElementById("agency-title");
const infoContainer = document.getElementById("agency-info");
const animList = document.getElementById("animations-list");
const reviewsBox = document.getElementById("reviews");
const reviewForm = document.getElementById("review-form");

async function loadAgency() {
  if (!id) return;
  const ref = doc(db, "agencies", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    titleEl.textContent = "Агентство не найдено";
    return;
  }
  currentAgency = { id: snap.id, ...snap.data() };
  titleEl.textContent = currentAgency.name || "Агентство";
  renderInfo();
  renderAnimations();
  await loadReviews();
}

function renderInfo() {
  infoContainer.innerHTML = "";
  const city = document.createElement("p");
  city.innerHTML = `<strong>Город:</strong> ${currentAgency.city || ""}`;
  const rating = document.createElement("p");
  rating.innerHTML = `<strong>Рейтинг:</strong> ${(currentAgency.rating ?? 4.5).toFixed ? currentAgency.rating.toFixed(1) : currentAgency.rating}`;
  const desc = document.createElement("p");
  desc.textContent = currentAgency.desc || "";

  infoContainer.appendChild(city);
  infoContainer.appendChild(rating);
  infoContainer.appendChild(desc);
}


const sortSelect = document.getElementById("sortSelect");

function sortAndRenderAnimations() {
  if (!currentAgency) return;
  const arr = Array.isArray(currentAgency.animations) ? [...currentAgency.animations] : [];
  const mode = sortSelect ? sortSelect.value : "price_asc";
  if (mode === "price_asc") arr.sort((a,b)=>(a.price||0)-(b.price||0));
  if (mode === "price_desc") arr.sort((a,b)=>(b.price||0)-(a.price||0));
  if (mode === "popularity_desc") arr.sort((a,b)=>(b.popularity||0)-(a.popularity||0));
  renderAnimationsList(arr);
}
if (sortSelect) sortSelect.addEventListener("change", sortAndRenderAnimations);

function renderAnimationsList(arr) {
  animList.innerHTML = "";
  if (!arr.length) {
    animList.innerHTML = `<p class="muted">У агентства пока нет добавленных анимаций.</p>`;
    return;
  }
  arr.forEach(an => {
    const priceTxt = (an.price || an.price === 0) ? `${an.price} ₸` : "—";
    const card = document.createElement("article");
    card.className = "agency-card";
    card.style.gridColumn = "span 12";
    card.innerHTML = `
      <div class="agency-info">
        <h3 class="agency-name">${an.name || "Анимация"}</h3>
        <p class="agency-desc">${an.desc || ""}</p>
        <p class="agency-rating"><strong>Цена:</strong> ${priceTxt}</p>
      </div>
    `;
    animList.appendChild(card);
  });
}

function renderAnimations() {
  sortAndRenderAnimations();
}

async function loadReviews() {
  reviewsBox.innerHTML = `<p class="muted">Загрузка отзывов...</p>`;
  const q = query(collection(db, "agencies", id, "reviews"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  if (snap.empty) {
    reviewsBox.innerHTML = `<p class="muted">Пока нет отзывов — станьте первым!</p>`;
    return;
  }
  const items = [];
  snap.forEach(docu => {
    const r = docu.data();
    const author = r.authorName || "Гость";
    const rating = r.rating ?? 5;
    const text = r.text || "";
    const dt = r.createdAt?.toDate?.() ? r.createdAt.toDate().toLocaleString() : "";
    items.push(`
      <article class="agency-card" style="grid-column: span 12;">
        <div class="agency-info">
          <p class="agency-rating"><strong>Оценка:</strong> ${rating}/5</p>
          <p class="agency-desc">${text}</p>
          <p class="agency-city"><strong>Автор:</strong> ${author} <span style="opacity:.6"> ${dt}</span></p>
        </div>
      </article>
    `);
  });
  reviewsBox.innerHTML = items.join("");
}

reviewForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const u = auth.currentUser;
  if (!u) { alert("Войдите, чтобы оставлять отзывы"); window.location.href = "auth.html"; return; }
  const text = (document.getElementById("reviewText").value || "").trim();
  const rating = parseInt(document.getElementById("reviewRating").value || "5", 10);
  if (!text) { alert("Напишите текст отзыва"); return; }
  try {
    await addDoc(collection(db, "agencies", id, "reviews"), {
      text, rating,
      authorUid: u.uid,
      authorName: u.displayName || u.email || "Пользователь",
      createdAt: serverTimestamp()
    });
    (document.getElementById("reviewText").value = "");
    document.getElementById("reviewRating").value = "5";
    await loadReviews();
    alert("Отзыв отправлен!");
  } catch (e2) {
    console.error(e2);
    alert("Не удалось отправить отзыв");
  }
});

document.addEventListener("firebase-ready", () => {
  mountAuthLink();
  onAuthStateChanged(auth, () => {});
  loadAgency();
});
