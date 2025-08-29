import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../services/emailService.js";

export const authResolvers = {
  Mutation: {
    signup: async (_, { user }) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await db
        .insert(users)
        .values({ ...user, password: hashedPassword })
        .returning();

      // Send welcome email
      sendWelcomeEmail(user.email, user.name); // fire-and-forget

      const token = jwt.sign(
        { userId: newUser[0].id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return { token, user: newUser[0] };
    },

    login: async (_, { email, password }) => {
      const user = (
        await db.select().from(users).where(eq(users.email, email))
      )[0];
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Incorrect password");

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return { token, user };
    },
  },
};
