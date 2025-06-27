// server/loadEnv.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure correct path for .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env file from /server folder
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("✅ Loaded env — GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("❌ Missing GOOGLE_CLIENT_ID — check your .env file!");
}
