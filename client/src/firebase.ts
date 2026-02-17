// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyD1OZm9WuOkvEJn_S5zAoQe8Eak_pPK52Q",
    authDomain: "medgrid-59ca4.firebaseapp.com",
    databaseURL: "https://medgrid-59ca4-default-rtdb.firebaseio.com",
    projectId: "medgrid-59ca4",
    storageBucket: "medgrid-59ca4.firebasestorage.app",
    messagingSenderId: "258902730900",
    appId: "1:258902730900:web:2dd189421ce39e3a8a2c81",
    measurementId: "G-KLDW025NDT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Optional: Add analytics if needed
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
