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

const admin = require("firebase-admin");
const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
  }),
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID
});

const db = admin.firestore(app);

async function list() {
  const snap = await db.collection("properties").get();
  const sorted = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => {
    const timeA = a.createdAt?.seconds ?? 0;
    const timeB = b.createdAt?.seconds ?? 0;
    return timeB - timeA;
  });

  console.log(`Total properties found: ${sorted.length}`);
  console.log("Top 10 recent properties:");
  sorted.slice(0, 10).forEach((p, idx) => {
    console.log(`${idx + 1}. Name: "${p.name}"`);
    console.log(`   Featured: ${p.featured}`);
    console.log(`   Images:`, p.images || p.photos || []);
    console.log(`   CreatedAt:`, p.createdAt);
  });
}

list();
