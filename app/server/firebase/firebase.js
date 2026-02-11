"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

// Import express
import express from 'express';

const appF = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Check if db is connected
export const checkDBconnection = async () => {
  try {
    await db.collection('test').get();
    console.log('Connected to Firestore');
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
  }
}