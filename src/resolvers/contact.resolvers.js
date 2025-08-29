import { db } from "../db/index.js";
import { contacts, users } from "../db/schema.js";
import { eq } from "drizzle-orm";

const isAuthenticated = (resolver) => (parent, args, context, info) => {
  if (!context.user) {
    throw new Error("UNAUTHORIZED");
  }
  return resolver(parent, args, context, info);
};

const ensureOwnership = async (contactId, userId) => {
  const [contact] = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, contactId));

  if (!contact) throw new Error("NOT_FOUND");
  if (contact.userId !== userId) throw new Error("FORBIDDEN");

  return contact;
};

const sanitizeEdits = (edits, allowedFields = ["phone", "address"]) =>
  Object.fromEntries(
    Object.entries(edits).filter(([key]) => allowedFields.includes(key))
  );

export const contactResolvers = {
  Query: {
    contacts: isAuthenticated(async (_, __, context) => {
      return await db
        .select()
        .from(contacts)
        .where(eq(contacts.userId, context.user.userId));
    }),

    contact: isAuthenticated(async (_, { id }, context) => {
      return await ensureOwnership(id, context.user.userId);
    }),
  },

  Contact: {
    user: async (parent) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, parent.userId));
      return user;
    },
  },

  Mutation: {
    addContact: isAuthenticated(async (_, { contact }, context) => {
      const [newContact] = await db
        .insert(contacts)
        .values({ ...contact, userId: context.user.userId })
        .returning();
      return newContact;
    }),

    // Update existing contact
    updateContact: isAuthenticated(async (_, { id, edits }, context) => {
      await ensureOwnership(id, context.user.userId);

      const sanitizedEdits = sanitizeEdits(edits);

      const [updatedContact] = await db
        .update(contacts)
        .set(sanitizedEdits)
        .where(eq(contacts.id, id))
        .returning();
      return updatedContact;
    }),

    deleteContact: isAuthenticated(async (_, { id }, context) => {
      await ensureOwnership(id, context.user.userId);

      const [deletedContact] = await db
        .delete(contacts)
        .where(eq(contacts.id, id))
        .returning();

      return deletedContact;
    }),
  },
};
