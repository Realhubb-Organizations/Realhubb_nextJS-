import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let _adminDb: Firestore | null = null;
let _adminAuth: Auth | null = null;

function getAdminApp(): App | null {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.trim();
    // Remove wrapping double quotes if any
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.substring(1, privateKey.length - 1).trim();
    }
    // Remove wrapping single quotes if any
    if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
      privateKey = privateKey.substring(1, privateKey.length - 1).trim();
    }
    // Replace all combinations of backslash and 'n' with actual newlines (e.g. \n, \\n, \\\n)
    privateKey = privateKey.replace(/\\+n/g, "\n");
    // Replace any backslashes followed by actual newlines/carriage returns
    privateKey = privateKey.replace(/\\+\r?\n/g, "\n");
    // Clean up any remaining backslashes (since PEM keys have no backslashes)
    privateKey = privateKey.replace(/\\/g, "");
  }

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("Firebase Admin setup skipped: missing configurations.", {
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey
    });
    return null;
  }

  if (getApps().length) return getApps()[0];

  console.log("Initializing Firebase Admin with:", {
    projectId,
    clientEmail,
    privateKeyLength: privateKey.length,
    privateKeyStart: privateKey.substring(0, 30),
    privateKeyEnd: privateKey.substring(privateKey.length - 30)
  });

  try {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    throw error;
  }
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

