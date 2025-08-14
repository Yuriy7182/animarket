
// firebase.js — теперь конфиг берётся из файла config.json (редактируй его, а не этот файл)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, collection, getDocs, getDoc, doc, addDoc, setDoc, updateDoc,
  query, where, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let firebaseConfig = null;
export let app = null;
export let auth = null;
export let db = null;

async function loadConfig() {
  try {
    const res = await fetch("config.json", { cache: "no-store" });
    if (!res.ok) throw new Error("config.json not found");
    firebaseConfig = await res.json();
    window.APP_CONFIG = firebaseConfig;
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    // Разрешаем запуск остального кода после инициализации
    document.dispatchEvent(new CustomEvent("firebase-ready"));
  } catch (e) {
    console.error("Не удалось загрузить config.json:", e);
    const warn = document.createElement("div");
    warn.style.cssText = "position:fixed;inset:10px auto auto 10px;background:#300;color:#fff;padding:10px;border-radius:8px;z-index:9999;";
    warn.textContent = "Ошибка: не найден config.json. Отредактируйте config.json и перезагрузите страницу.";
    document.body.appendChild(warn);
  }
}
loadConfig();

// Навигационная ссылка "Войти/Профиль"
export function mountAuthLink() {
  const link = document.getElementById("navLink");
  if (!link) return;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      link.textContent = "Профиль";
      link.href = "profile.html";
    } else {
      link.textContent = "Войти";
      link.href = "auth.html";
    }
  });
}

export {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, updateProfile,
  collection, getDocs, getDoc, doc, addDoc, setDoc, updateDoc,
  query, where, orderBy, serverTimestamp
};
