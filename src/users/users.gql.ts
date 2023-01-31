export const usersTypeDefs = `#graphql
    type User {
        userId: String!
        email: String!
        userName: String
    }

    type Query {
        user: User
    }
`;
