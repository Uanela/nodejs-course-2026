import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default db;
