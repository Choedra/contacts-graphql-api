import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const client = postgres(process.env.DATABASE_URL);

export default {
  schema: "./src/db/schema.js",      // path to your Drizzle schema
  out: "./drizzle/migrations",       // folder to store migrations
  dialect: "postgresql",             // <--- required
  dbCredentials: client              // <--- your postgres client
};
