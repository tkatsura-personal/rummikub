import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


// .env file content
//VITE_FIREBASE_API_KEY=your-api-key
//VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
//VITE_FIREBASE_PROJECT_ID=your-project-id
//VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
//VITE_FIREBASE_MESSAGING_SENDER_ID=sender-id
//VITE_FIREBASE_APP_ID=your-app-id