import { authResolvers } from "./auth.resolvers.js";
import { contactResolvers } from "./contact.resolvers.js";

export const resolvers = {
  Query: {
    ...contactResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...contactResolvers.Mutation,
  },
  Contact: {
    ...contactResolvers.Contact,
  },
};
