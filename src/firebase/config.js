import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCcZYk3ysceTG9snd--jO3mJFB1wycCx28",
  authDomain: "pending-tasks-app.firebaseapp.com",
  projectId: "pending-tasks-app",
  storageBucket: "pending-tasks-app.firebasestorage.app",
  messagingSenderId: "1013491501599",
  appId: "1:1013491501599:web:a66cffeeefb2323d81a32a",
  measurementId: "G-29TSPW4CD1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);