const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

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

function getAdminApp() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

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
    const snap = await db.collection("blogPosts").where("slug", "==", "why-solcrest-hennur-road-keeps-coming-up-in-buyer-conversations").get();
    if (snap.empty) {
      console.log("No blog post found with slug 'why-solcrest-hennur-road-keeps-coming-up-in-buyer-conversations'");
      // Let's print list of slugs instead
      const allPosts = await db.collection("blogPosts").get();
      console.log("Slugs available:");
      allPosts.forEach(doc => {
        console.log(`- ${doc.data().slug}`);
      });
      return;
    }
    const doc = snap.docs[0];
    console.log("Title:", doc.data().title);
    console.log("Content Length:", doc.data().content ? doc.data().content.length : 0);
    console.log("Content Sample:\n", doc.data().content ? doc.data().content.slice(0, 2000) : "");
  } catch (err) {
    console.error("Failed with error:", err);
  }
}

test();
