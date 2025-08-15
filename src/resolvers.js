// resolvers.js
import { db } from "./db/index.js";
import { users, contacts } from "./db/schema.js";
import { eq } from "drizzle-orm";

export const resolvers = {
  Query: {
    users: async () => await db.select().from(users),
    user: async (_, { id }) => (await db.select().from(users).where(eq(users.id, id)))[0],

    contacts: async () => await db.select().from(contacts),
    contact: async (_, { id }) => (await db.select().from(contacts).where(eq(contacts.id, id)))[0],
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
    addUser: async (_, { user }) => {
      const newUser = await db.insert(users).values(user).returning();
      return newUser[0];
    },
    updateUser: async (_, { id, edits }) => {
      const updatedUser = await db.update(users).set(edits).where(eq(users.id, id)).returning();
      return updatedUser[0];
    },
    deleteUser: async (_, { id }) => {
      await db.delete(users).where(eq(users.id, id));
      return await db.select().from(users);
    },

    addContact: async (_, { contact }) => {
      const newContact = await db.insert(contacts).values(contact).returning();
      return newContact[0];
    },
    updateContact: async (_, { id, edits }) => {
      const updatedContact = await db.update(contacts).set(edits).where(eq(contacts.id, id)).returning();
      return updatedContact[0];
    },
    deleteContact: async (_, { id }) => {
      await db.delete(contacts).where(eq(contacts.id, id));
      return await db.select().from(contacts);
    },
  },
};
