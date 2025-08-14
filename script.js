/* === AniMarket runtime patch ===
   This block makes required UI changes without touching the original markup.
   - Rename title to "АниМаркет"
   - Remove "Профиль" button
   - Remove the "Минимальный рейтинг" filter on search
   - Separate and fix top-right role buttons, set destinations
   - Show user pill (Имя Фамилия) if saved in localStorage
*/
(function () {
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
  function byText(tags, pattern){
    const rex = (pattern instanceof RegExp) ? pattern : new RegExp(pattern, "i");
    for(const tag of tags){
      for(const el of qsa(tag)){
        if (rex.test(el.textContent.trim())) return el;
      }
    }
    return null;
  }
  function changeTitle(){
    const el = byText(["h1","h2",".brand-title",".title"], /Поиск аниматоров/);
    if(el){ el.textContent = "АниМаркет"; }
  }
  function removeProfile(){
    const el = byText(["a","button"], /Профиль/);
    if(el && el.parentElement){ el.remove(); }
  }
  function removeRatingFilter(){
    const label = byText(["label"], /Минимальный рейтинг/);
    if(label){
      const wrap = label.closest(".field, .form-group, .input-group, .filter, div") || label;
      wrap.style.display = "none";
      return;
    }
    // fallback: select that has options "Любой" / "4+" / "4.5+" / "5.0"
    for (const sel of qsa("select")){
      const has = Array.from(sel.options || []).some(o => /Любой|4\+|4\.5\+|5\.0/i.test(o.text || ""));
      if(has){
        (sel.closest(".field, .form-group, .input-group, .filter, div") || sel).style.display = "none";
        break;
      }
    }
  }
  function fixRoleButtons(){
    const client = byText(["a","button"], /Для клиентов/);
    const agency = byText(["a","button"], /Для агентств/);
    if(client){
      client.style.marginRight = "12px";
      client.style.zIndex = "1";
      if (client.tagName === "A") client.setAttribute("href", "auth.html?role=client");
      client.addEventListener("click", (e)=>{
        if(client.tagName !== "A"){ e.preventDefault(); location.href = "auth.html?role=client"; }
      }, {once:true});
    }
    if(agency){
      agency.style.marginLeft = "12px";
      agency.style.zIndex = "1";
      if (agency.tagName === "A") agency.setAttribute("href", "auth.html?role=agency");
      agency.addEventListener("click", (e)=>{
        if(agency.tagName !== "A"){ e.preventDefault(); location.href = "auth.html?role=agency"; }
      }, {once:true});
    }
  }
  function showUserPill(){
    const user = JSON.parse(localStorage.getItem("am_user") || "null");
    if(!user || !user.name) return;
    // try to find left area in header; otherwise inject
    let host = document.querySelector(".user-pill-host");
    if(!host){
      const header = document.querySelector("header") || document.body;
      host = document.createElement("div");
      host.className = "user-pill-host";
      Object.assign(host.style, {position:"absolute", top:"12px", left:"12px", zIndex: 10});
      header.appendChild(host);
    }
    const pill = document.createElement("div");
    pill.className = "user-pill";
    pill.textContent = user.name;
    host.innerHTML = "";
    host.appendChild(pill);
  }
  document.addEventListener("DOMContentLoaded", function () {
    try{
      changeTitle();
      removeProfile();
      removeRatingFilter();
      fixRoleButtons();
      showUserPill();
    }catch(e){ console.warn("AniMarket patch error", e); }
  });
})();
// Данные о агентствах (пример для прототипа)
const agencies = [
  {
    id: 1,
    name: "Весёлые герои",
    city: "Павлодар",
    desc: "Организация детских праздников с любимыми супергероями. Большой опыт и индивидуальный подход.",
    characters: ["Человек‑паук", "Бэтмен", "Капитан Марвел"],
    rating: 4.8,
    image: "https://picsum.photos/id/1011/400/300",
    animations: [
      { name: "Человек‑паук", price: 15000, popularity: 5 },
      { name: "Бэтмен", price: 16000, popularity: 4 },
      { name: "Капитан Марвел", price: 14000, popularity: 3 }
    ]
  },
  {
    id: 2,
    name: "Сказочный мир",
    city: "Аксу",
    desc: "Агентство, которое подарит детям настоящую сказку. Яркие костюмы и волшебные персонажи.",
    characters: ["Эльза", "Принцесса София", "Рапунцель"],
    rating: 4.2,
    image: "https://picsum.photos/id/1015/400/300",
    animations: [
      { name: "Эльза", price: 12000, popularity: 5 },
      { name: "Принцесса София", price: 11000, popularity: 3 },
      { name: "Рапунцель", price: 13000, popularity: 4 }
    ]
  },
  {
    id: 3,
    name: "Супер команда",
    city: "Астана",
    desc: "Мы знаем, как увлечь детей всех возрастов. От супергероев до сказочных персонажей — всё для вашего праздника.",
    characters: ["Супермен", "Чудо‑женщина", "Человек‑паук"],
    rating: 4.5,
    image: "https://picsum.photos/id/1005/400/300",
    animations: [
      { name: "Супермен", price: 17000, popularity: 4 },
      { name: "Чудо‑женщина", price: 15500, popularity: 5 },
      { name: "Человек‑паук", price: 16000, popularity: 3 }
    ]
  }
];
// === ДОБАВЛЕНО: локальные агентства из admin.html ===
const CUSTOM_KEY = "agenciesCustom";
function getCustomAgencies() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function mergedAgencies() {
  const base = (agencies || []).map(a => ({...a}));
  const extra = getCustomAgencies();
  return base.concat((extra || []).map(a => ({
    id: a.id || String(Date.now()),
    name: a.name || "Агентство",
    city: a.city || "",
    desc: a.desc || "",
    rating: typeof a.rating === "number" ? a.rating : 4.5,
    characters: Array.isArray(a.characters) ? a.characters : [],
    image: a.image || "",
    animations: Array.isArray(a.animations) ? a.animations : []
  })));
}


// Функция для рендеринга списка агентств
function renderAgencies(list) {
  const container = document.getElementById("agency-list");
  container.innerHTML = "";
  const template = document.getElementById("agency-template").content;
  list.forEach(agency => {
    const clone = document.importNode(template, true);
    const card = clone.querySelector(".agency-card");
    const img = clone.querySelector(".agency-image");
    const nameEl = clone.querySelector(".agency-name");
    const cityEl = clone.querySelector(".agency-city span");
    const descEl = clone.querySelector(".agency-desc");
    const charactersEl = clone.querySelector(".agency-characters span");
    const ratingEl = clone.querySelector(".agency-rating span");
    const detailsBtn = clone.querySelector(".btn-details");

    img.src = agency.image;
    img.alt = agency.name;
    nameEl.textContent = agency.name;
    cityEl.textContent = agency.city;
    descEl.textContent = agency.desc;
    charactersEl.textContent = agency.characters.join(", ");
    ratingEl.textContent = agency.rating.toFixed(1);
    detailsBtn.dataset.agencyId = agency.id;
    container.appendChild(clone);
  });
}

// Функция для применения фильтров
function applyFilters() {
  const query = document.getElementById("query").value.toLowerCase();
  const minRating = parseFloat(document.getElementById("rating").value);
  const selectedCity = document.getElementById("city").value;
  const filtered = agencies.filter(agency => {
    const matchesCity = !selectedCity || agency.city === selectedCity;
    const matchesQuery =
      !query ||
      agency.name.toLowerCase().includes(query) ||
      agency.characters.some(ch => ch.toLowerCase().includes(query));
    const matchesRating = agency.rating >= minRating;
    return matchesCity && matchesQuery && matchesRating;
  });
  renderAgencies(filtered);
}

// Функция для перехода на страницу агентства
function openAgency(event) {
  const btn = event.target;
  const id = btn.dataset.agencyId;
  if (id) {
    // сохраняем выбранное агентство в localStorage для доступа на странице деталей
    localStorage.setItem('selectedAgencyId', id);
    window.location.href = 'agency.html?id=' + id;
  }
}

// Инициализируем список при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  renderAgencies(mergedAgencies());
});