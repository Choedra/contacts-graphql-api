export const typeDefs = `#graphql
type User {
  id: ID!
  name: String!
  email: String!
  contacts: [Contact!]!
}

type Contact {
  id: ID!
  phone: String!
  address: String
  user: User!
}

type Query {
  users: [User]
  user(id: ID!): User
  contacts: [Contact]
  contact(id: ID!): Contact
}

type Mutation {
  signup(user: SignupInput!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!

  addUser(user: AddUserInput!): User
  updateUser(id: ID!, edits: EditUserInput!): User
  deleteUser(id: ID!): [User]

  addContact(contact: AddContactInput!): Contact
  updateContact(id: ID!, edits: EditContactInput!): Contact
  deleteContact(id: ID!): [Contact]
}

input AddUserInput {
  name: String!
  email: String!
}

input EditUserInput {
  name: String
  email: String
}

input AddContactInput {
  phone: String!
  address: String
}

input EditContactInput {
  phone: String
  address: String
}

input SignupInput {
  name: String!
  email: String!
  password: String!
}

type AuthPayload {
  token: String!
  user: User!
}
`;
