// server/loadEnv.js
import dotenv from "dotenv";
dotenv.config();

console.log("✅ Loaded env — GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("❌ Missing GOOGLE_CLIENT_ID — check your .env file!");
}
