'use client';
// React imports
import React from 'react'

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { getFirestore, doc, collection, getDocs, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.CLIENT_FIREBASE_WEB_API_KEY,
  authDomain: process.env.CLIENT_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.CLIENT_FIREBASE_PROJECT_ID,
  storageBucket: process.env.CLIENT_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.CLIENT_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.CLIENT_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


export default function signUpPage() {

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