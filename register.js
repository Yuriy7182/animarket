/* === AniMarket: role-aware registration forms & validation === */
(function(){
  function qs(s){ return document.querySelector(s); }
  function ensureRoot(id){
    let root = document.getElementById(id);
    if(!root){
      root = document.createElement("div");
      root.id = id;
      document.body.appendChild(root);
    }
    return root;
  }
  function phoneValid(v){ return /^\+7\d{10}$/.test(v||""); }
  function clientUI(root){
    root.innerHTML = `
      <div class="auth-page" style="max-width:560px;margin:40px auto;">
        <h1>Регистрация клиента</h1>
        <div class="card" style="display:flex;flex-direction:column;gap:12px;padding:20px;background:rgba(255,255,255,.05);border-radius:12px;">
          <label>Имя</label><input id="f_name" style="padding:10px;border-radius:10px;">
          <label>Фамилия</label><input id="l_name" style="padding:10px;border-radius:10px;">
          <label>Адрес</label><input id="addr" style="padding:10px;border-radius:10px;">
          <label>Квартира</label><input id="apt" style="padding:10px;border-radius:10px;">
          <label>Номер телефона</label>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="opacity:.8;">+7</span>
            <input id="phone" value="+7" style="padding:10px;border-radius:10px;flex:1;">
          </div>
          <button id="submit" class="primary" disabled style="opacity:.5;padding:12px 16px;border-radius:12px;">Зарегистрироваться</button>
        </div>
      </div>`;
    const inputs = ["#f_name","#l_name","#addr","#apt","#phone"].map(qs);
    function check(){
      const ok = inputs.every(el=>el.value.trim()) && phoneValid(inputs[4].value);
      const btn = qs("#submit");
      btn.disabled = !ok;
      btn.style.opacity = ok ? "1" : ".5";
    }
    inputs.forEach(el => el.addEventListener("input", check));
    check();
    qs("#submit").addEventListener("click", ()=>{
      const name = `${qs("#f_name").value.trim()} ${qs("#l_name").value.trim()}`.trim();
      localStorage.setItem("am_user", JSON.stringify({name}));
      location.href = "index.html";
    });
  }
  function agencyUI(root){
    root.innerHTML = `
      <div class="auth-page" style="max-width:560px;margin:40px auto;">
        <h1>Регистрация агентства</h1>
        <div class="card" style="display:flex;flex-direction:column;gap:12px;padding:20px;background:rgba(255,255,255,.05);border-radius:12px;">
          <label>Почта</label><input id="email" type="email" style="padding:10px;border-radius:10px;">
          <label>Номер телефона</label><input id="phone" value="+7" style="padding:10px;border-radius:10px;">
          <button id="submit" class="primary" disabled style="opacity:.5;padding:12px 16px;border-radius:12px;">Отправить</button>
        </div>
        <div id="modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);align-items:center;justify-content:center;">
          <div style="background:#111827;padding:24px;border-radius:16px;max-width:420px;">
            <h3>Данные переданы</h3>
            <p>Ждите обратной связи. Спасибо!</p>
            <button id="ok" class="primary" style="margin-top:10px;padding:10px 14px;border-radius:10px;">Ок</button>
          </div>
        </div>
      </div>`;
    function valid(){
      const email = qs("#email").value.trim();
      const phone = qs("#phone").value.trim();
      return /.+@.+\..+/.test(email) && phoneValid(phone);
    }
    function check(){
      const ok = valid();
      const btn = qs("#submit");
      btn.disabled = !ok;
      btn.style.opacity = ok ? "1" : ".5";
    }
    qs("#email").addEventListener("input", check);
    qs("#phone").addEventListener("input", check);
    check();
    qs("#submit").addEventListener("click", ()=>{
      qs("#modal").style.display = "flex";
    });
    qs("#ok").addEventListener("click", ()=>{
      qs("#modal").style.display = "none";
      location.href = "index.html";
    });
  }
  document.addEventListener("DOMContentLoaded", ()=>{
    const root = ensureRoot("register-root");
    const role = new URLSearchParams(location.search).get("role")==="agency" ? "agency":"client";
    (role==="agency" ? agencyUI : clientUI)(root);
  });
})();
// Скрипт регистрации пользователя
function registerUser() {
  // Получаем значения из формы
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const city = document.getElementById('cityReg').value.trim();
  const street = document.getElementById('street').value.trim();
  const entrance = document.getElementById('entrance').value.trim();
  const floor = document.getElementById('floor').value.trim();
  const apartment = document.getElementById('apartment').value.trim();
  const photoInput = document.getElementById('photo');
  // Проверка обязательных полей
  if (!firstName || !lastName || !city || !street) {
    alert('Пожалуйста, заполните все обязательные поля.');
    return;
  }
  const user = {
    firstName,
    lastName,
    city,
    street,
    entrance,
    floor,
    apartment,
    photo: null,
  };
  // Функция сохранения пользователя
  const saveUser = () => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(user));
      alert('Регистрация успешно завершена!');
      window.location.href = 'index.html';
    } catch (e) {
      console.error('Ошибка при сохранении данных пользователя:', e);
      alert('Не удалось сохранить данные.');
    }
  };
  // Если выбран файл для фото, считываем его как Data URL
  if (photoInput && photoInput.files && photoInput.files[0]) {
    const file = photoInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      user.photo = e.target.result;
      saveUser();
    };
    reader.onerror = function (e) {
      console.warn('Не удалось прочитать файл. Регистрация без фото.', e);
      saveUser();
    };
    reader.readAsDataURL(file);
  } else {
    saveUser();
  }
}