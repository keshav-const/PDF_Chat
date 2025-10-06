// import dotenv from "dotenv";

// // Load environment variables from .env file
// dotenv.config();

// // Export environment variables with proper typing
// export const config = {
//   DATABASE_URL: process.env.DATABASE_URL,
//   SUPABASE_URL: process.env.SUPABASE_URL,
//   SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
//   GEMINI_API_KEY: process.env.GEMINI_API_KEY,
//   NODE_ENV: process.env.NODE_ENV || 'development',
//   PORT: parseInt(process.env.PORT || '5000', 10),
//   SESSION_SECRET: process.env.SESSION_SECRET || 'default-session-secret-change-in-production'
// } as const;

// import { z } from "zod";
// import dotenv from "dotenv";
// import path from "path";

// // Load environment variables
// dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// const configSchema = z.object({
//   DATABASE_URL: z.string(),
//   SUPABASE_URL: z.string().optional(),
//   SUPABASE_ANON_KEY: z.string().optional(),
//   SUPABASE_BUCKET: z.string().optional(),
//   GEMINI_API_KEY: z.string().optional(),
//   NODE_ENV: z.string().default("development"),
//   PORT: z.coerce.number().default(5000),
//   SESSION_SECRET: z.string().default("supersecret"),
// });

// export const config = configSchema.parse(process.env);


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
