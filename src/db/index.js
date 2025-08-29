import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const client = postgres(process.env.DATABASE_PUBLIC_URL);
export const db = drizzle(client);

console.log("✅ Connected to PostgreSQL via Drizzle");
