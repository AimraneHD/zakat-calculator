import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
  : undefined;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

// 1. Only initialize if we are NOT building or if the keys actually exist!
if (!getApps().length && projectId && clientEmail && privateKey) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

// 2. THE FIX: Only grab Firestore IF the app was successfully initialized.
// If it's the Vercel build step and there's no app, we just pass an empty dummy object 
// so the compiler doesn't crash.
const adminDb = getApps().length > 0 ? getFirestore() : (null as any);

export { adminDb };