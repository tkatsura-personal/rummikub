'use client';
// React imports
import React from 'react';
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase";

export default function ResetPasswordPage() {
  const [email, setEmail] = React.useState('');
  const router = useNavigate();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

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

        <button type="button" className="button" onClick={() => router('/')}>
            Back
            <div className="arrow-wrapper">
            <div className="arrow"></div>
            </div>
        </button>
      </div>
    </>
  )
}