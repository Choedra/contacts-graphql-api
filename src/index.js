import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 🚀 Standalone server with fixed context
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const authHeader = req?.headers?.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        // Match what resolvers expect
        return { user: { userId: payload.userId } };
      } catch (err) {
        console.error("JWT verify error:", err.message);
        throw new Error("Invalid token");
      }
    }
    return {};
  },
});

console.log(`Server ready at ${url}`);
