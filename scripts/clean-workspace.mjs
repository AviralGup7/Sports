import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const targets = [
  ".next",
  ".next-e2e",
  "coverage",
  "dist",
  "test-results",
  ".codex-dev.log",
  ".codex-next-err.log",
  ".codex-next-out.log",
  ".codex-start-3100.err.log",
  ".codex-start-3100.out.log",
  ".next-dev.err.log",
  ".next-dev.out.log",
  "dev-android-pass.log",
  "admin-android-fixed.png",
  "admin-android.png",
  "android-admin-matches-after.png",
  "android-admin-matches-mid-final.png",
  "android-admin-matches-mid-fixed2.png",
  "android-admin-matches-top-after2.png",
  "android-admin-matches-top-final.png",
];

let removedCount = 0;

for (const target of targets) {
  const targetPath = path.join(rootDir, target);

  try {
    await rm(targetPath, { force: true, recursive: true });
    removedCount += 1;
    console.log(`removed ${target}`);
  } catch (error) {
    console.warn(`skipped ${target}: ${error.message}`);
  }
}

console.log(`cleanup complete (${removedCount} targets processed)`);
