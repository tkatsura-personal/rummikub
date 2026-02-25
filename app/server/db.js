import admin from "firebase-admin";
import dotenv from 'dotenv';
import serviceAccount from './tk-rummikub-admin.json' with { type: 'json' };

dotenv.config();

// Read private key from .env and add into serviceAccount object (since private key contains newlines, it can't be stored directly in the JSON file)
serviceAccount.private_key = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
serviceAccount.private_key_id = process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID;
serviceAccount.client_email = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
serviceAccount.client_id = process.env.FIREBASE_ADMIN_CLIENT_ID;
serviceAccount.client_x509_cert_url = process.env.FIREBASE_ADMIN_CLIENT_x509_CERT_URL;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
export default { db };