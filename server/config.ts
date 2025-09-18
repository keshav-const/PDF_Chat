import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Export environment variables with proper typing
export const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  SESSION_SECRET: process.env.SESSION_SECRET || 'default-session-secret-change-in-production'
} as const;