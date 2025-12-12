"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
