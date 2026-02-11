'use client';

// React imports
import React from "react";
// Firebase imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, collection, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import { useRouter } from 'next/navigation';

const firebaseConfig = {
  apiKey: "AIzaSyCFTpkgx5tJIh20WevByxRBLP3yG_7o_es",
  authDomain: "tk-rummikub-global.firebaseapp.com",
  projectId: "tk-rummikub-global",
  storageBucket: "tk-rummikub-global.firebasestorage.app",
  messagingSenderId: "309063129091",
  appId: "1:309063129091:web:3808dc02a76d575e06d636",
  measurementId:"G-WHWC76MQ71"
};

export default function game() {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const token = await auth.currentUser.getIdToken();

    fetch("/api/table", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ someData: 123 }),
    });


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
        <div>
            <h3>The game does not exist yet, I'm sorry :&#40;</h3>
        </div>
    );
};