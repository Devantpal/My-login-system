import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  if (user) {

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {
      const data = snap.data();

      document.getElementById("userInfo").innerHTML = `
        ${user.photoURL ? `<img src="${user.photoURL}" width="80" style="border-radius:50%">` : ""}
        <p>Email: ${data.email}</p>
        <p>Mobile: ${data.mobile || "N/A"}</p>
        <p>Gender: ${data.gender || "N/A"}</p>
        <p>Role: ${data.role}</p>
      `;
    }

  } else {
    window.location.href = "index.html";
  }
});

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};