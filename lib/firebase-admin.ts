import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let _adminDb: Firestore | null = null;
let _adminAuth: Auth | null = null;

function getAdminApp(): App | null {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) return null;

  if (getApps().length) return getApps()[0];

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    projectId,
  });
}

export function getAdminDb(): Firestore {
  if (_adminDb) return _adminDb;
  const app = getAdminApp();
  if (!app) throw new Error("Firebase Admin not configured");
  _adminDb = getFirestore(app);
  return _adminDb;
}

export function getAdminAuth(): Auth {
  if (_adminAuth) return _adminAuth;
  const app = getAdminApp();
  if (!app) throw new Error("Firebase Admin not configured");
  _adminAuth = getAuth(app);
  return _adminAuth;
}

// Legacy named export alias used in firestoreServerService.ts
export { getAdminDb as adminDb };

