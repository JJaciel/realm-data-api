export const usersTypeDefs = `#graphql
    type User {
        userId: String!
        email: String!
        username: String
    }

    type Query {
        user: User
    }

    type Mutation {
        updateUserUsername(username: String!): User
    }
`;
