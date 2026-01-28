import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  getAuth
} from "firebase/auth";

import { 
  getFirestore, 
  doc, 
  collection, 
  getDocs, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";

import React from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./firebaseConfig";
import { useRouter } from 'next/navigation';


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export async function checkDBconnection() {
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
}

export async function createUser(email: string, password: string): Promise<void> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "users", uid), {
      email,
      createdAt: serverTimestamp()
    });
    console.log("User signed up");
    console.log(auth.currentUser);
  } catch (error) {
    console.error("Error signing up:", error);
    return;
  }
}

export async function loginUser(email: string, password: string): Promise<void> {
  try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        email,
        createdAt: serverTimestamp()
      });
      console.log("User signed up");
      console.log(auth.currentUser);
  } catch (error) {
      console.error("Error signing up:", error);
      return;
  }
}

export async function logout(): Promise<void> {
  return await signOut(auth);
}
