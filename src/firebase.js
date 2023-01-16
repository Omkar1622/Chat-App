// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Project Name in Firebase :- chatApp-New
const firebaseConfig = {
  apiKey: "AIzaSyCUz-nYhqI8r6twihLERLKjfqtFRVvb_2w",
  authDomain: "chatapp-new-3ff03.firebaseapp.com",
  projectId: "chatapp-new-3ff03",
  storageBucket: "chatapp-new-3ff03.appspot.com",
  messagingSenderId: "218806312919",
  appId: "1:218806312919:web:dc7b0909b29faf417bb592"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// For Authentication
export const auth = getAuth(app);

// To Store Images
export const storage = getStorage(app);

// To Store The Data of Users (FireStore)
export const db = getFirestore(app);