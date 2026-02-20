import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* Toast */
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* Error Handler */
function handleAuthError(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      showToast("Email already registered", "error");
      break;
    case "auth/invalid-email":
      showToast("Invalid email format", "error");
      break;
    case "auth/weak-password":
      showToast("Password must be at least 6 characters", "error");
      break;
    case "auth/user-not-found":
      showToast("User not found", "error");
      break;
    case "auth/wrong-password":
      showToast("Incorrect password", "error");
      break;
    default:
      showToast("Something went wrong", "error");
  }
}

/* Tab Switching */
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

loginTab.onclick = () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
};

registerTab.onclick = () => {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
};

/* REGISTER */
window.register = async function () {

  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const mobile = document.getElementById("registerMobile").value;
  const gender = document.getElementById("registerGender").value;

  if (!email || !password || !mobile || !gender) {
    showToast("All fields are required", "error");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await sendEmailVerification(userCredential.user);

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      mobile,
      gender,
      role: "user",
      provider: "email",
      createdAt: new Date()
    });

    showToast("Verification email sent!", "success");

  } catch (error) {
    handleAuthError(error);
  }
};

/* LOGIN */
window.login = async function () {

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    if (!userCredential.user.emailVerified) {
      showToast("Verify your email first", "error");
      return;
    }

    showToast("Login Successful!", "success");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);

  } catch (error) {
    handleAuthError(error);
  }
};

/* GOOGLE LOGIN */
window.googleLogin = async function () {

  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: user.displayName,
      photo: user.photoURL,
      role: "user",
      provider: "google",
      createdAt: new Date()
    }, { merge: true });

    showToast("Google Login Successful!", "success");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);

  } catch (error) {
    handleAuthError(error);
  }
};

/* RESET PASSWORD */
window.resetPassword = async function () {
  const email = document.getElementById("loginEmail").value;

  if (!email) {
    showToast("Enter email first", "error");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showToast("Reset email sent!", "success");
  } catch (error) {
    handleAuthError(error);
  }
};