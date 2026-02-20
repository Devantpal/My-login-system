import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

  if (user) {

    document.getElementById("userInfo").innerHTML = `
      ${user.photoURL ? `<img src="${user.photoURL}" width="80" style="border-radius:50%">` : ""}
      <p>${user.displayName || ""}</p>
      <p>${user.email}</p>
    `;

  } else {
    window.location.href = "index.html";
  }
});

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};