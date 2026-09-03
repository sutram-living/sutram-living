import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVMoR4GaPmpl3oAF7ClwFqQRPvkUzi4yw",
  authDomain: "sutram-living-789e7.firebaseapp.com",
  projectId: "sutram-living-789e7",
  storageBucket: "sutram-living-789e7.firebasestorage.app",
  messagingSenderId: "1037665222970",
  appId: "1:1037665222970:web:146985d789c2f7300a9003"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);