// server.js
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "*"; // fallback for testing
const JWT_SECRET = process.env.JWT_SECRET; // no fallback in prod, force it

if (!JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET not set! Using insecure fallback.");
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: async ({ req }) => {
    const authHeader = req?.headers?.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET || "supersecret");
        return { user: { userId: payload.userId } };
      } catch (err) {
        console.error("JWT verify error:", err.message);
        throw new Error("Invalid token");
      }
    }

    return {}; // no user if no token
  },
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

console.log(`🚀 Server ready at ${url}`);
