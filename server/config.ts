
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const configSchema = z.object({
  DATABASE_URL: z.string(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_BUCKET: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(5000),
  SESSION_SECRET: z.string().default("supersecret"),
});

export const config = configSchema.parse(process.env);
