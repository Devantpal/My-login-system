import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDf_eg6rmbvb_4sM_haZCRc0oOxtI7HqS8",
    authDomain: "myloginapp-4e769.firebaseapp.com",
    projectId: "myloginapp-4e769",
    storageBucket: "myloginapp-4e769.firebasestorage.app",
    messagingSenderId: "111106458658",
    appId: "1:111106458658:web:bc11898fc27c4b46fff67b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);