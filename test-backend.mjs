import { readFileSync } from "node:fs";
import { GoogleGenAI } from "@google/genai";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const GEMINI_FREE_MODEL = "gemini-2.5-flash";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  process.env[trimmed.slice(0, eq)] ??= trimmed.slice(eq + 1);
}

// Test Firestore
try {
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  initializeApp({ credential: cert(sa) });
  await getFirestore().collection("inventory").limit(1).get();
  console.log("✅ Firestore OK");
} catch (e) {
  console.error("❌ Firestore:", e.code ?? e.name, e.message);
}

// Test Gemini (@google/genai supports AQ. keys from AI Studio)
try {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: GEMINI_FREE_MODEL,
    contents: "hello",
  });
  console.log("✅ Gemini OK:", response.text?.slice(0, 50));
} catch (e) {
  console.error("❌ Gemini:", e.message);
}
