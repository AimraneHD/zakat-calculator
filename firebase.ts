
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACIRwJ4Bunqqb3D8Zan7NAolBBoECApNU",
  authDomain: "zakat-calculator-ab1c2.firebaseapp.com",
  projectId: "zakat-calculator-ab1c2",
  storageBucket: "zakat-calculator-ab1c2.firebasestorage.app",
  messagingSenderId: "957640315883",
  appId: "1:957640315883:web:8baf9e37d75a327afa3fae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the Database and export it so the rest of the app can use it
export const db = getFirestore(app);