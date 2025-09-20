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

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "./config";
import * as schema from "../shared/schema";

// Create a connection pool to your database
const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

// Create the Drizzle instance and export it
export const db = drizzle(pool, { schema });