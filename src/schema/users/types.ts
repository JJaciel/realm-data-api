// GQL types, typedefs including Query and Mutation

export const UserTypes = `#graphql
    type User {
        userId: String!
        email: String!
        username: String
    }

    extend type Query {
        getUser: User!
    }

    extend type Mutation {
        updateUserUsername(username: String!): User!
    }
`;
