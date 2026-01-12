'use client';
// React imports
import React from 'react';
import { useRouter } from 'next/navigation';

// Firebase imports
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { getFirestore, doc, collection, getDocs, setDoc, serverTimestamp } from "firebase/firestore";

function login() {
    const router = useRouter();

    return (
        <div>
            <h3>The page you are looking for could not be found :&#40;</h3>
            <button type="button" className="button" onClick={() => router.push('/')}>
                Go to Home Page
                <div className="arrow-wrapper">
                <div className="arrow"></div>
                </div>
            </button>
        </div>
    );
}

export default login;