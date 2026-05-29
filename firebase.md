// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuA4chajsfua_BdBWNNhL5p5h2NpUtExA",
  authDomain: "warunggemini.firebaseapp.com",
  projectId: "warunggemini",
  storageBucket: "warunggemini.firebasestorage.app",
  messagingSenderId: "653073694029",
  appId: "1:653073694029:web:6dfb68a79a675082e38b04",
  measurementId: "G-FNB6WRK2MS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);