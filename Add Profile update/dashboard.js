import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));

  if (snap.exists()) {

    const data = snap.data();

    document.getElementById("userInfo").innerHTML = `
      ${user.photoURL ? `<img src="${user.photoURL}" width="80">` : ""}
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Mobile:</strong> ${data.mobile || "N/A"}</p>
      <p><strong>Gender:</strong> ${data.gender || "N/A"}</p>
      <p><strong>Role:</strong> ${data.role}</p>
    `;

    if (data.role === "admin") {
      document.getElementById("adminMenu").classList.remove("hidden");
      showAdminSection();
    }
  }
});

function showAdminSection() {
  document.getElementById("adminSection").innerHTML = `
    <div class="admin-box">
      <h2>Admin Panel</h2>
      <p>You have administrative access.</p>
    </div>
  `;
}

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

window.goProfile = function () {
  window.location.href = "profile.html";
};

window.goDashboard = function () {
  window.location.href = "dashboard.html";
};