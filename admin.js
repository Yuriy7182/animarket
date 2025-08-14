// Простое локальное хранение агентств для MVP через localStorage
// Ключ, где лежат добавленные вручную агентства
const CUSTOM_KEY = "agenciesCustom";

function getCustomAgencies() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Ошибка чтения agenciesCustom", e);
    return [];
  }
}

function setCustomAgencies(list) {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
  } catch (e) {
    alert("Не удалось сохранить агентство (localStorage переполнен?)");
  }
}

function saveAgency() {
  const name = document.getElementById("name").value.trim();
  const city = document.getElementById("city").value.trim();
  const rating = parseFloat(document.getElementById("rating").value || "4.5") || 4.5;
  const desc = document.getElementById("desc").value.trim();
  const charactersRaw = document.getElementById("characters").value.trim();
  const image = document.getElementById("image").value.trim();
  const animName = document.getElementById("animName").value.trim();
  const animPrice = parseInt(document.getElementById("animPrice").value || "0", 10);

  if (!name || !city) {
    alert("Название и город обязательны");
    return;
  }

  const nextId = Date.now().toString(); // простой уникальный id
  const characters = charactersRaw ? charactersRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

  const animations = [];
  if (animName && animPrice > 0) {
    animations.push({
      name: animName,
      price: animPrice,
      popularity: 0,
      image: image || ""
    });
  }

  const agency = {
    id: nextId,
    name,
    city,
    desc,
    characters,
    rating: Math.max(0, Math.min(5, rating)),
    image: image || "",
    animations
  };

  const list = getCustomAgencies();
  list.push(agency);
  setCustomAgencies(list);

  alert("Агентство сохранено!");
  clearForm();
  renderList();
}

function clearForm() {
  document.getElementById("agencyForm").reset();
}

function removeAgency(id) {
  const list = getCustomAgencies().filter(a => a.id !== id);
  setCustomAgencies(list);
  renderList();
}

function renderList() {
  const box = document.getElementById("list");
  const list = getCustomAgencies();
  if (!list.length) {
    box.innerHTML = '<p class="muted">Пока нет локальных агентств.</p>';
    return;
  }
  box.innerHTML = list.map(a => `
    <article class="agency-card" style="grid-column: span 12;">
      <div class="agency-info">
        <h3 class="agency-name">${a.name}</h3>
        <p class="agency-city"><strong>Город:</strong> ${a.city}</p>
        <p class="agency-desc">${a.desc || ""}</p>
        <p class="agency-characters"><strong>Персонажи:</strong> ${(a.characters||[]).join(", ")}</p>
        <p class="agency-rating"><strong>Рейтинг:</strong> ${a.rating?.toFixed ? a.rating.toFixed(1) : a.rating}</p>
        <button class="btn btn--ghost" onclick="removeAgency('${a.id}')">Удалить</button>
      </div>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", renderList);
