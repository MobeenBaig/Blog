// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-blog-aca6a.firebaseapp.com",
  projectId: "mern-blog-aca6a",
  storageBucket: "mern-blog-aca6a.firebasestorage.app",
  messagingSenderId: "222168622526",
  appId: "1:222168622526:web:e08f7d18e7b784192645ef"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);