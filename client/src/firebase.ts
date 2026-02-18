// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyD1OZm9WuOkvEJn_S5zAoQe8Eak_pPK52Q",
    authDomain: "medgrid-59ca4.firebaseapp.com",
    databaseURL: "https://medgrid-59ca4-default-rtdb.firebaseio.com",
    projectId: "medgrid-59ca4",
    storageBucket: "medgrid-59ca4.firebasestorage.app",
    messagingSenderId: "258902730900",
    appId: "1:258902730900:web:5e159b32e62e4c1b8a2c81",
    measurementId: "G-2BRCS0GRS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };
