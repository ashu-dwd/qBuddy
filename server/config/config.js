import { config } from "dotenv";
config({ path: "./.env.local" });

export const PORT = process.env.PORT;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const GEMINI_MODEL_NAME = process.env.GEMINI_MODEL_NAME;
