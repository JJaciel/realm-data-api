import { UserTypes } from "./users/types";
import { UserQuery } from "./users/query";
import { UserMutation } from "./users/mutation";

export const typeDefs = `#graphql
    type Query
    type Mutation
    ${UserTypes}
`;

export const resolvers = {
  Query: {
    ...UserQuery,
  },
  Mutation: {
    ...UserMutation,
  },
};
