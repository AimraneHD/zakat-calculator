import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// We pack your secrets into an object and use "as string" 
// so TypeScript knows for sure they aren't empty.
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID as string,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') as string,
};

// Check if a connection already exists, if not, create one!
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// Get the VIP database connection
const adminDb = getFirestore();

export { adminDb };