import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQy-HNnXOgFW5VV3ZF1HMKySUPN2n7ETs",
  authDomain: "xi-c4-project.firebaseapp.com",
  projectId: "xi-c4-project",
  storageBucket: "xi-c4-project.firebasestorage.app",
  messagingSenderId: "1052292104269",
  appId: "1:1052292104269:web:7b678f29be0d117cad5c04",
  measurementId: "G-RDYWD4VMQX"
};

// Initialize Firebase & Firestore Database
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);