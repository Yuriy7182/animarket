
import { auth, onAuthStateChanged, db, collection, addDoc } from "./firebase.js";

document.addEventListener("firebase-ready", () => {
  const form = document.getElementById("register-form");
  if (!form) return;

  onAuthStateChanged(auth, (user) => {
    const hdr = document.querySelector("header h1");
    if (user) {
      hdr.textContent = "Регистрация агентства";
    } else {
      hdr.textContent = "Регистрация (войдите чтобы добавить агентство)";
    }
  });

  form.addEventListener("submit", async () => {
    const user = auth.currentUser;
    if (!user) { alert("Пожалуйста, войдите (auth.html), чтобы добавить агентство."); window.location.href = "auth.html"; return; }

    const name = document.getElementById("firstName")?.value?.trim() || "";
    const surname = document.getElementById("lastName")?.value?.trim() || "";
    const city = document.getElementById("city")?.value?.trim() || "";
    const address = document.getElementById("address")?.value?.trim() || "";
    const entrance = document.getElementById("entrance")?.value?.trim() || "";
    const floor = document.getElementById("floor")?.value?.trim() || "";
    const apartment = document.getElementById("apartment")?.value?.trim() || "";
    const phone = document.getElementById("phone")?.value?.trim() || "";
    const email = document.getElementById("email")?.value?.trim() || "";

    try {
      const ref = await addDoc(collection(db, "agencies"), {
        name: (document.getElementById("agencyName")?.value?.trim() || "Агентство"),
        city,
        desc: (document.getElementById("description")?.value?.trim() || ""),
        characters: [],
        rating: 4.5,
        image: "",
        animations: [],
        contact: { address, entrance, floor, apartment, phone, email, owner: `${name} ${surname}` },
        ownerUid: auth.currentUser.uid,
        createdAt: new Date()
      });
      alert("Агентство отправлено! ID: " + ref.id);
      window.location.href = "agency.html?id=" + ref.id;
    } catch (e) {
      console.error(e);
      alert("Не удалось сохранить агентство");
    }
  });
});
