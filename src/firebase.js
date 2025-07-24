import { initializeApp } from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxCu5qunXBnuUR6hhKFeRIh-IJk7tBqis",
  authDomain: "coner-database.firebaseapp.com",
  projectId: "coner-database",
  storageBucket: "coner-database.firebasestorage.app",
  messagingSenderId: "1006786060667",
  appId: "1:1006786060667:web:516ae639121897bf121dde",
  measurementId: "G-0C0YN8B7TP",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

// Firebase 서비스 가져오기
const auth = firebaseAuth.getAuth(app); // 인증
const db = getFirestore(app); // Firestore 데이터베이스
const storage = getStorage(app); // 스토리지

export { app, auth, db, storage, analytics };
