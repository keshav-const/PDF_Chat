// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import { config } from "./config.ts";
// import * as schema from "../shared/schema.ts";

// // Create a connection pool to your database
// const pool = new Pool({
//   connectionString: config.DATABASE_URL,
// });

// // Create the Drizzle instance and export it
// export const db = drizzle(pool, { schema });

// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import { config } from "./config";
// import * as schema from "../shared/schema";

// // Create a connection pool to your database
// const pool = new Pool({
//   connectionString: config.DATABASE_URL,
// });

// // Create the Drizzle instance and export it
// export const db = drizzle(pool, { schema });

// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import { config } from "./config";
// import * as schema from "../shared/schema";

// // Create a connection pool to your database
// const pool = new Pool({
//   connectionString: config.DATABASE_URL,
//   // --- THIS IS THE FINAL, CORRECT FIX ---
//   // This configuration is required for a stable connection to Supabase.
//   // It ensures the connection is secure and prevents the pooler from terminating it.
//   ssl: {
//     require: true,
//     rejectUnauthorized: false, // This is often needed in development environments
//   },
// });

// // Create the Drizzle instance and export it
// export const db = drizzle(pool, { schema });

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "./config";
import * as schema from "../shared/schema";

// This will now correctly use the DATABASE_URL you just added to your .env
const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

// Create the Drizzle instance and export it
export const db = drizzle(pool, { schema });