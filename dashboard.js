import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser;
let currentUserRole;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  const snap = await getDoc(doc(db, "users", user.uid));

  if (!snap.exists()) return;

  const data = snap.data();
  currentUserRole = data.role;

  document.getElementById("userInfo").innerHTML = `
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Role:</strong> ${data.role}</p>
  `;

  if (data.role === "admin") {
    document.getElementById("adminMenu").classList.remove("hidden");
    loadAllUsers();
  }
});

/* LOAD ALL USERS */
async function loadAllUsers() {

  const querySnapshot = await getDocs(collection(db, "users"));

  let tableHTML = `
    <div class="admin-box">
      <h2>User Management</h2>
      <table class="admin-table">
        <tr>
          <th>Email</th>
          <th>Mobile</th>
          <th>Gender</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
  `;

  querySnapshot.forEach((docSnap) => {
    const user = docSnap.data();
    const uid = docSnap.id;

    tableHTML += `
      <tr>
        <td>${user.email}</td>
        <td>${user.mobile || "-"}</td>
        <td>${user.gender || "-"}</td>
        <td>${user.role}</td>
        <td>
          <button onclick="toggleRole('${uid}', '${user.role}')">
            ${user.role === "admin" ? "Demote" : "Promote"}
          </button>
          <button class="danger-btn" onclick="deleteUser('${uid}')">
            Delete
          </button>
        </td>
      </tr>
    `;
  });

  tableHTML += `</table></div>`;

  document.getElementById("adminSection").innerHTML = tableHTML;
}

/* PROMOTE / DEMOTE */
window.toggleRole = async function (uid, role) {

  if (uid === currentUser.uid) {
    alert("You cannot change your own role!");
    return;
  }

  const newRole = role === "admin" ? "user" : "admin";

  await updateDoc(doc(db, "users", uid), {
    role: newRole
  });

  loadAllUsers();
};

/* DELETE USER */
window.deleteUser = async function (uid) {

  if (uid === currentUser.uid) {
    alert("You cannot delete yourself!");
    return;
  }

  if (!confirm("Are you sure you want to delete this user?")) return;

  await deleteDoc(doc(db, "users", uid));

  loadAllUsers();
};

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

window.goProfile = () => window.location.href = "profile.html";
window.goDashboard = () => window.location.href = "dashboard.html";