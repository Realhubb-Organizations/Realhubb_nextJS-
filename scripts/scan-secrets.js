/* eslint-disable */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Define regex patterns for common secrets and credentials
const SECRET_RULES = [
  {
    name: "Google / Firebase API Key",
    pattern: /AIzaSy[a-zA-Z0-9_-]{33}/g,
  },
  {
    name: "Generic Private Key (PEM/SSH)",
    pattern: /-----BEGIN[ A-Z0-9_-]+PRIVATE KEY-----/g,
  },
  {
    name: "MongoDB Connection String with Password",
    pattern: /mongodb(\+srv)?:\/\/[a-zA-Z0-9_.-]+:[a-zA-Z0-9_.-]+@/gi,
  },
  {
    name: "Firebase Private Key JSON Field",
    pattern: /"private_key"\s*:\s*"-----BEGIN/gi,
  },
  {
    name: "General DB Password / Secret Assignment",
    pattern: /(db_password|database_password|db_pass|client_secret|api_secret)\s*[:=]\s*['"`][a-zA-Z0-9_!@#$%^&*()-+=]{6,80}['"`]/gi,
  },
  {
    name: "Slack Webhook URL",
    pattern: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]{8}\/B[a-zA-Z0-9_]{8}\/[a-zA-Z0-9_]{24}/gi,
  }
];

// Helper to mask secrets in console messages for security
function maskSecret(match) {
  if (match.length <= 8) return "*".repeat(match.length);
  return match.slice(0, 4) + "*".repeat(match.length - 8) + match.slice(-4);
}

function getStagedFiles() {
  try {
    // Get list of files that are staged (modified and added to index)
    const output = execSync("git diff --cached --name-only --diff-filter=d", { encoding: "utf-8" });
    return output.split("\n").map(f => f.trim()).filter(Boolean);
  } catch {
    console.warn("⚠️ [Secret Scanner] Git is not available or this is not a repository. Skipping scan.");
    return [];
  }
}

function scan() {
  console.log("🔍 [Secret Scanner] Scanning staged files for exposed secrets...");
  const files = getStagedFiles();
  
  if (files.length === 0) {
    console.log("✅ [Secret Scanner] No staged files to scan.");
    process.exit(0);
  }

  let foundSecrets = false;

  for (const file of files) {
    // Skip external lockfiles, example env configuration templates, or compiled next output
    if (
      file.includes("package-lock.json") ||
      file.includes(".env.local.example") ||
      file.includes("ENV_SETUP.md") ||
      file.includes("ENV_SETUP_ALT.md") ||
      file.startsWith(".next/") ||
      file.startsWith("node_modules/")
    ) {
      continue;
    }

    const filePath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(filePath)) continue;

    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      for (const rule of SECRET_RULES) {
        // Reset regex index for safety
        rule.pattern.lastIndex = 0;
        
        let match;
        while ((match = rule.pattern.exec(line)) !== null) {
          const matchedText = match[0];
          console.error(
            `❌ \x1b[31m[Secret Leaked]\x1b[0m In file \x1b[33m${file}\x1b[0m (Line ${i + 1}): Found potential ${rule.name}: "${maskSecret(matchedText)}"`
          );
          foundSecrets = true;
        }
      }
    }
  }

  if (foundSecrets) {
    console.error(
      "\n🚨 \x1b[41m\x1b[37m[COMMIT BLOCKED]\x1b[0m Exposed secrets or private keys were detected in your staged files."
    );
    console.error("Please remove the credentials or move them into `.env.local` before committing.\n");
    process.exit(1);
  } else {
    console.log("✅ [Secret Scanner] No hardcoded secrets detected. Code is secure to commit.");
    process.exit(0);
  }
}

scan();
