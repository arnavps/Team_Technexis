import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC3Two05Wf51EZdkTrr1KD_edBJhq1R2xU",
    authDomain: "project-9ff34.firebaseapp.com",
    projectId: "project-9ff34",
    storageBucket: "project-9ff34.firebasestorage.app",
    messagingSenderId: "113020307334",
    appId: "1:113020307334:web:9923ad7479a53006a78e07",
    measurementId: "G-5503VJJYNX"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
