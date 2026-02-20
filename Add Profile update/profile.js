import { auth, db } from "./firebase.js";
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  const snap = await getDoc(doc(db, "users", user.uid));

  if (snap.exists()) {
    const data = snap.data();
    document.getElementById("editName").value = data.name || "";
    document.getElementById("editMobile").value = data.mobile || "";
    document.getElementById("editGender").value = data.gender || "";
  }
});

window.updateProfile = async function () {

  const name = document.getElementById("editName").value;
  const mobile = document.getElementById("editMobile").value;
  const gender = document.getElementById("editGender").value;

  await updateDoc(doc(db, "users", currentUser.uid), {
    name,
    mobile,
    gender
  });

  alert("Profile updated successfully!");
};

window.goDashboard = function () {
  window.location.href = "dashboard.html";
};

window.goProfile = function () {
  window.location.href = "profile.html";
};

window.logout = function () {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
};