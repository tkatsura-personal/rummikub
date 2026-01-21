'use client';
// React imports
import React from 'react'

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { getFirestore, doc, collection, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_WEB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};


export default function signUpPage() {

  console.log(firebaseConfig.apiKey);
  console.log(firebaseConfig.authDomain);
  console.log(firebaseConfig.projectId);
  console.log(firebaseConfig.storageBucket);
  console.log(firebaseConfig.messagingSenderId);
  console.log(firebaseConfig.appId);
  console.log(firebaseConfig.measurementId);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  async function signUp(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "users", uid), {
      displayName,
      email,
      createdAt: serverTimestamp()
    });
  }
  
  React.useEffect(() => {
    async function testConnection() {
      try {
        const snapshot = await getDocs(collection(db, "test"));
        console.log(
          "✅ Firebase connected:",
          snapshot.empty ? "No docs found" : `${snapshot.size} docs found`
        );
        snapshot.forEach(doc => {
          console.log("📄 Doc:", doc.id, doc.data());
        });
      } catch (err) {
        console.error("❌ Firebase error:", err);
      }
    }
    testConnection();
  }, []);

  return (
    <>
      <div>
        {}
      </div>
    </>
  )

}