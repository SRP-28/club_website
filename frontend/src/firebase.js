import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChvColRVokPBbAOiXv8P26ScRyDxPJI2w",
  authDomain: "team-vajra.firebaseapp.com",
  projectId: "team-vajra",
  storageBucket: "team-vajra.firebasestorage.app",
  messagingSenderId: "865557876116",
  appId: "1:865557876116:web:9f0ee78cee3c157df75381",
  measurementId: "G-TN5CL22RSH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
