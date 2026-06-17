import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as path from "path";
import * as fs from "fs";

// Load .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const fileContent = fs.readFileSync(envPath, "utf-8");
  const lines = fileContent.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

async function checkTeam() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.log("Missing credentials.");
    return;
  }

  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        projectId,
      });
    }
    const db = getFirestore();
    const snap = await db.collection("team").orderBy("order", "asc").get();
    
    console.log(`Found ${snap.size} team members in Firestore:`);
    snap.docs.forEach((doc, idx) => {
      const data = doc.data();
      console.log(`${idx + 1}. [Order: ${data.order}] Name: ${data.name} | Role: ${data.role}`);
      console.log(`   Photo: "${data.photo}"`);
      console.log(`   Bio: "${data.bio ? data.bio.slice(0, 80) + '...' : ''}"`);
    });
  } catch (error) {
    console.error("Error checking team:", error);
  }
}

checkTeam();
