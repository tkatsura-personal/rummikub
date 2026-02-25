// React imports
import React from "react";
// Firebase imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, collection, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import firebase from 'firebase/compat/app';

export default function game() {
    //const app = initializeApp(firebaseConfig);
    //const db = getFirestore(app);
    //const token = await auth.currentUser.getIdToken();

    /*fetch("/api/table", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        //"Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ someData: 123 }),
    });*/

    return (
        <div>
            <h3>The game does not exist yet, I'm sorry :&#40;</h3>
        </div>
    );
};