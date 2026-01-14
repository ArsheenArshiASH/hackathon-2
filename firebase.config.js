import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
// auth
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged  ,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import { getFirestore ,collection, addDoc, serverTimestamp} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCYCNdn47auQDql0v1zufRDctf7X299aDY",
    authDomain: "mini-hackathon2.firebaseapp.com",
    projectId: "mini-hackathon2",
    storageBucket: "mini-hackathon2.firebasestorage.app",
    messagingSenderId: "901429277858",
    appId: "1:901429277858:web:4a15f8b7fca2b2043b93fb"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider ,
  onAuthStateChanged,
 sendPasswordResetEmail,

 db ,
 collection, 
 addDoc,
 serverTimestamp
};
