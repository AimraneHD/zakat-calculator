import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

const privateKey = process.env.FIREBASE_PRIVATE_KEY ? (
  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') // apparently this is us fixing
                                                        // vercel's mistake of confusing
                                                       // actual strings "\n" with the
                                                      // newline "\n"
) : (undefined);

// If we dont include the condition getApps().length i.e checking how many apps are running
// ...building new changes would attempt to init firebase twice
// Init'ing firebase twice => crash 
// fact: getApps().length returns how many apps are running

if (!getApps().length && projectId && clientEmail && privateKey) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey
    }),
  });
}

// Only grab Firestore IF the app was successfully initialized
const adminDb = getApps().length > 0 ? getFirestore() : (null as any);

export { adminDb };