// Core and third-party modules
import AWS from "aws-sdk";
import { ApolloServer } from "@apollo/server";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
import dotenv from "dotenv";
import { authMiddleware } from "./utils/auth.mjs";
import db from "./config/connection.mjs";
import typeDefs from "./schemas/typeDefs.mjs";
import resolvers from "./schemas/resolvers.mjs";
import { toErrorResult } from "./utils/toErrorResult.mjs";
import jwt from "jsonwebtoken";

// Initialize environment variables
dotenv.config();

await db;

// AWS SDK Configuration
AWS.config.update({
  region: process.env.S3_REGION,
});
const s3 = new AWS.S3();

// Create Apollo server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  formatError: (error) => {
    return toErrorResult(error);
  },
});

// Lambda Handler
export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: async ({ event, context }) => {
      const authHeader =
        event.headers?.authorization || event.headers?.Authorization;

      let userId = null;
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.id;
        } catch (err) {
          console.error("Token verification failed:", err.message);
        }
      }

      return {
        lambdaEvent: event,
        lambdaContext: context,
        user: userId,
      };
    },
  }
);
