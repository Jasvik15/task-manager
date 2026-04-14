import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5quo5WFSkAr7AZG4_rb6vjbABMnVGx14",
  authDomain: "tasks-dashboard-7061e.firebaseapp.com",
  projectId: "tasks-dashboard-7061e",
  storageBucket: "tasks-dashboard-7061e.firebasestorage.app",
  messagingSenderId: "306322949381",
  appId: "1:306322949381:web:5fc35d3a6bfd2bdac3e36c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);