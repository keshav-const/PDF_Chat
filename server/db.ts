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

// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import { config } from "./config";
// import * as schema from "../shared/schema";

// // This will now correctly use the DATABASE_URL you just added to your .env
// const pool = new Pool({
//   connectionString: config.DATABASE_URL,
// });

// // Create the Drizzle instance and export it
// export const db = drizzle(pool, { schema });


// import { drizzle } from 'drizzle-orm/node-postgres';
// import { neon, neonConfig } from '@neondatabase/serverless';
// import { Pool } from 'pg';
// import { config } from '../server/config.js';

// // This is required for Vercel
// neonConfig.fetchConnectionCache = true;

// let db;

// if (config.NODE_ENV === 'production') {
//   // Use Neon for production
//   const sql = neon(config.DATABASE_URL!);
//   db = drizzle(sql);
// } else {
//   // Use node-postgres for development
//   const pool = new Pool({
//     connectionString: config.DATABASE_URL,
//   });
//   db = drizzle(pool);
// }

// export { db };

// import { drizzle as drizzleNodePostgres, NodePgDatabase } from 'drizzle-orm/node-postgres';
// import { drizzle as drizzleNeon, NeonHttpDatabase } from 'drizzle-orm/neon-http';
// import { neon, neonConfig } from '@neondatabase/serverless';
// import { Pool } from 'pg';
// import { config } from '../server/config.js';
// import * as schema from '../shared/schema.js';

// // This is required for Vercel
// neonConfig.fetchConnectionCache = true;

// // Define a type that can be either of the two database types
// let db: NodePgDatabase<typeof schema> | NeonHttpDatabase<typeof schema>;

// if (config.NODE_ENV === 'production') {
//   // Use Neon for production
//   const sql = neon(config.DATABASE_URL!);
//   // Use the drizzle function from 'drizzle-orm/neon-http'
//   db = drizzleNeon(sql, { schema });
// } else {
//   // Use node-postgres for development
//   const pool = new Pool({
//     connectionString: config.DATABASE_URL,
//   });
//   // Use the drizzle function from 'drizzle-orm/node-postgres'
//   db = drizzleNodePostgres(pool, { schema });
// }

// export { db };

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "../server/config.js";
import * as schema from "../shared/schema.js";

// Always use node-postgres (works for both local + Render + Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool, { schema });
