'use client';
// React imports
import React from 'react';

// Firebase imports
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_WEB_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId:process.env.FIREBASE_MEASUREMENT_ID
};


export default function signUpPage() {

  const [email, setEmail] = React.useState('');

  return (
    <>
      <div>
        <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder = "Email"
         />

         <button type="button" className="button" onClick={() => sendPasswordResetEmail(auth, email)}>
            Reset Password
            <div className="arrow-wrapper">
            <div className="arrow"></div>
            </div>
        </button>

        <button type="button" className="button" onClick={() => router.push('/')}>
            Back
            <div className="arrow-wrapper">
            <div className="arrow"></div>
            </div>
        </button>
      </div>
    </>
  )

}