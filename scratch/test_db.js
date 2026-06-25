const fs = require("fs");
const path = require("path");

// Parse .env.local manually
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

// Mock file aliases so we don't need compilation
const admin = require("firebase-admin");

function getAdminApp() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  console.log("Project ID:", projectId);
  console.log("Client Email:", clientEmail);
  console.log("Private Key length:", privateKey ? privateKey.length : 0);

  if (!projectId || !clientEmail || !privateKey) {
    console.error("Missing FIREBASE_ADMIN env variables!");
    return null;
  }

  if (admin.apps.length) return admin.apps[0];

  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    projectId,
  });
}

async function test() {
  try {
    const app = getAdminApp();
    if (!app) return;
    const db = admin.firestore(app);
    console.log("Querying 'leads' collection...");
    const snap = await db.collection("leads").get();
    console.log(`Found ${snap.size} leads.`);
    snap.docs.forEach((doc) => {
      const data = doc.data();
      console.log(`ID: ${doc.id} | Name: ${data.name} | Type: ${data.type} | ResumeUrl: ${data.resumeUrl}`);
    });
  } catch (err) {
    console.error("Connection failed with error:", err);
  }
}

test();
