import express, { Request, Response, Application, NextFunction } from "express";
import http from "http";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { getPort, getAllowedCors } from "./util/envVars";
import { initializeFirebase } from "./services/auth.service";
import { getApolloServerConfig, contextMiddleware } from "./gql/server.config";

const app: Application = express();
const httpServer = http.createServer(app);

const port = getPort() || 3000;
const allowedCors = getAllowedCors() || "http://localhost:8080";

const apolloServer = new ApolloServer<{ userId: string }>({
  ...getApolloServerConfig(),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  introspection: true,
});

initializeFirebase();

(async () => {
  await apolloServer.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({ origin: allowedCors }),
    bodyParser.json(),
    expressMiddleware<{ userId: string }>(apolloServer, {
      context: contextMiddleware,
    })
  );
  app.use((req, res) => {
    res.status(404).send({ error: "Route not found" });
  });

  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);
})();

const server = httpServer.listen({ port });
console.log(`🚀  Server is running on port ${port}`);

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down server...");
  server.close(() => {
    console.log("Server stopped accepting new connections");
  });

  // Wait for existing connections to close
  server.on("close", () => {
    console.log("Server closed");
    process.exit(0);
  });
});

function logErrors(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err.message);
  console.log("Path: ", req.path);
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
}

interface CustomError extends Error {
  status: number;
}

function errorHandler(err: CustomError, req: Request, res: Response) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
}
