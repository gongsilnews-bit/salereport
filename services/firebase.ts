
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Updated with latest config from the provided image
const firebaseConfig = {
  apiKey: "AIzaSyBVS8NVi_-Dj6wcoOcYWw-1VVZWJULBRdY",
  authDomain: "gongsilnews-6f11b.firebaseapp.com",
  projectId: "gongsilnews-6f11b",
  storageBucket: "gongsilnews-6f11b.firebasestorage.app",
  messagingSenderId: "280226605271",
  appId: "1:280226605271:web:12a3369ac71b0206576892",
  measurementId: "G-8E26H81JFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics is optional but included in the config image
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
