
import { db, collection, getDocs, mountAuthLink } from "./firebase.js";

const agencyListEl = document.getElementById("agency-list");
const template = document.getElementById("agency-template");
const cityEl = document.getElementById("city");
const queryEl = document.getElementById("query");
const ratingEl = document.getElementById("rating");

let agencies = [];

async function fetchAgencies() {
  const snap = await getDocs(collection(db, "agencies"));
  agencies = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  render(agencies);
}

function matches(a, term) {
  if (!term) return true;
  const t = term.toLowerCase();
  return (
    a.name?.toLowerCase().includes(t) ||
    a.city?.toLowerCase().includes(t) ||
    (Array.isArray(a.characters) && a.characters.join(" ").toLowerCase().includes(t))
  );
}

function render(list) {
  agencyListEl.innerHTML = "";
  list.forEach(a => {
    const node = template.content.cloneNode(true);
    node.querySelector(".agency-image").src = a.image || "";
    node.querySelector(".agency-name").textContent = a.name || "Агентство";
    node.querySelector(".agency-city span").textContent = a.city || "";
    node.querySelector(".agency-desc").textContent = a.desc || "";
    node.querySelector(".agency-characters span").textContent = Array.isArray(a.characters) ? a.characters.join(", ") : "";
    node.querySelector(".agency-rating span").textContent = (a.rating ?? 4.5).toFixed ? a.rating.toFixed(1) : a.rating;
    const btn = node.querySelector(".btn-details");
    btn.dataset.agencyId = a.id;
    btn.addEventListener("click", () => {
      localStorage.setItem("selectedAgencyId", a.id);
      window.location.href = `agency.html?id=${a.id}`;
    });
    agencyListEl.appendChild(node);
  });
}

window.applyFilters = function applyFilters() {
  const term = (queryEl.value || "").trim();
  const minRating = parseFloat(ratingEl.value || "0");
  const city = cityEl.value;

  const filtered = agencies.filter(a => {
    const byCity = city ? (a.city === city) : true;
    const byRating = typeof a.rating === "number" ? a.rating >= minRating : true;
    return byCity && byRating && matches(a, term);
  });
  render(filtered);
};

document.addEventListener("firebase-ready", async () => {
  mountAuthLink();
  await fetchAgencies();
});
