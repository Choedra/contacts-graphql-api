// resolvers.js
import { db } from "./db/index.js";
import { users, contacts } from "./db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const resolvers = {
  Query: {
    users: async () => await db.select().from(users),
    user: async (_, { id }) => (await db.select().from(users).where(eq(users.id, id)))[0],

    contacts: async (_, __, context) => {
      if (!context.user) throw new Error("Unauthorized");
      return await db
        .select()
        .from(contacts)
        .where(eq(contacts.userId, context.user.userId));
    },
    contact: async (_, { id }, context) => {
      if (!context.user) throw new Error("Unauthorized");

      const contact = (await db.select().from(contacts).where(eq(contacts.id, id)))[0];
      if (!contact || contact.userId !== context.user.userId) throw new Error("Not allowed");

      return contact;
    },

  },

  User: {
    contacts: async (parent) =>
      await db.select().from(contacts).where(eq(contacts.userId, parent.id)),
  },

  Contact: {
    user: async (parent) =>
      (await db.select().from(users).where(eq(users.id, parent.userId)))[0],
  },

  Mutation: {
    signup: async (_, { user }) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await db.insert(users).values({ ...user, password: hashedPassword }).returning();
      const token = jwt.sign({ userId: newUser[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return { token, user: newUser[0] };
    },

    login: async (_, { email, password }) => {
      const user = (await db.select().from(users).where(eq(users.email, email)))[0];
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Incorrect password");

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return { token, user };
    },

    // addUser: async (_, { user }) => {
    //   const newUser = await db.insert(users).values(user).returning();
    //   return newUser[0];
    // },
    // updateUser: async (_, { id, edits }) => {
    //   const updatedUser = await db.update(users).set(edits).where(eq(users.id, id)).returning();
    //   return updatedUser[0];
    // },
    // deleteUser: async (_, { id }) => {
    //   await db.delete(users).where(eq(users.id, id));
    //   return await db.select().from(users);
    // },

    addContact: async (_, { contact }, context) => {
      if (!context.user) throw new Error("Unauthorized")

      const newContact = await db
        .insert(contacts)
        .values({ ...contact, userId: context.user.userId})
        .returning();
      return newContact[0];
    },
    updateContact: async (_, { id, edits }, context) => {
      if (!context.user) throw new Error("Unathorized")

      const contact = (await db.select().from(contacts).where(eq(contacts.id, id)))[0];
      if (!contact) throw new Error("Contact not found");
      if (contact.userId !== context.user.userId) throw new Error("Unauthorized");

      const updatedContact = await db
        .update(contacts)
        .set(edits)
        .where(eq(contacts.id, id))
        .returning();
  return updatedContact[0];
    },
    deleteContact: async (_, { id }, context) => {
      if (!context.user) throw new Error("Unauthorized");

      const contact = (await db.select().from(contacts).where(eq(contacts.id, id)))[0];
        if (!contact) throw new Error("Contact not found");
        if (contact.userId !== context.user.userId) throw new Error("Forbidden");
        
      await db.delete(contacts).where(eq(contacts.id, id));
      return await db.select().from(contacts).where(eq(contacts.userId, context.user.userId));
    },
  },
};
