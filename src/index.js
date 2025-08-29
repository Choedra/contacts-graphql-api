import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  context: async ({ req }) => {
    const authHeader = req?.headers?.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        return { user: { userId: payload.userId } };
      } catch (err) {
        console.error("JWT verify error:", err.message);
        throw new Error("Invalid token");
      }
    }
    return {};
  },
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

console.log(`Server ready at ${url}`);
