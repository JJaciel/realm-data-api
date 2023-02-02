import { IncomingMessage } from "http";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { verifyToken } from "./jwt";

import { typeDefs, resolvers } from "../schema";

export const getApolloServerConfig = () => ({
  typeDefs: typeDefs,
  resolvers: resolvers,
  introspection: true,
  //   includeStacktraceInErrorResponses: false,
  formatError: (formattedError: GraphQLFormattedError, error: unknown) => {
    return {
      message: formattedError.message,
      code: (error as any).extensions.code,
      details: (error as any).extensions.details,
    };
  },
});

export const contextMiddleware = async ({ req }: { req: IncomingMessage }) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token)
    throw new GraphQLError("Authentication error", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
        details: "Token required",
      },
    });

  try {
    const { userId } = verifyToken(token) as { userId: string };

    // to-do: verify if user exists on db

    if (!userId)
      throw new GraphQLError("Authentication error", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
          details: "User is not authenticated",
        },
      });

    return { userId };
  } catch (err) {
    throw new GraphQLError("Authentication error", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
        details: "Token expired",
      },
    });
  }
};
