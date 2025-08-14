
import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");
const btnIn = document.getElementById("btnSignIn");
const btnUp = document.getElementById("btnSignUp");
const fields = document.getElementById("clientFields");

function clean(v){ return (v||'').trim(); }
function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function enable(){ btnIn.disabled = false; btnUp.disabled = false; }
function showFields(){ if(fields) fields.style.display = 'block'; }

document.addEventListener("firebase-ready", () => {
  enable();
  btnUp.addEventListener("click", async () => {
    showFields();
    const email = clean(emailEl.value);
    const pass = clean(passEl.value);
    if(!validEmail(email)) return alert("Проверь формат email (например, name@example.com).");
    if(pass.length < 6) return alert("Пароль должен быть не короче 6 символов.");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const profile = {
        firstName: clean(document.getElementById("firstName")?.value),
        lastName: clean(document.getElementById("lastName")?.value),
        address: clean(document.getElementById("address")?.value),
        apartment: clean(document.getElementById("apartment")?.value),
        floor: clean(document.getElementById("floor")?.value),
        entrance: clean(document.getElementById("entrance")?.value),
        phone: clean(document.getElementById("phone")?.value),
        email,
        createdAt: new Date()
      };
      await setDoc(doc(db, "users", cred.user.uid), profile);
      window.location.href = "index.html";
    } catch(e) {
      alert("Не удалось создать аккаунт: " + (e.code || e.message || e));
    }
  });

  btnIn.addEventListener("click", async () => {
    const email = clean(emailEl.value);
    const pass = clean(passEl.value);
    if(!validEmail(email)) return alert("Проверь формат email.");
    if(pass.length < 6) return alert("Пароль должен быть не короче 6 символов.");
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      window.location.href = "index.html";
    } catch(e) {
      alert("Не удалось войти: " + (e.code || e.message || e));
    }
  });
});
