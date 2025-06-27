// server/loadEnv.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 👇 these two lines help get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 Load .env from this folder (server/.env)
dotenv.config({ path: path.resolve(__dirname, ".env") });

// 👇 Debug log
console.log("✅ Loaded env — GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

// 👇 Fail fast if GOOGLE_CLIENT_ID is missing
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("❌ Missing GOOGLE_CLIENT_ID — check your .env file!");
}
