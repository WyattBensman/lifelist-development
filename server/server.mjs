// Core and third-party modules
import AWS from "aws-sdk";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateLambdaHandler } from "@as-integrations/aws-lambda";
import dotenv from "dotenv";
import { authMiddleware } from "./utils/auth.mjs";
import db from "./config/connection.mjs";
import typeDefs from "./schemas/typeDefs.mjs";
import resolvers from "./schemas/resolvers.mjs";

// Initialize environment variables
dotenv.config();

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
  playground: true,
});

// Lambda Handler
export const graphqlHandler = startServerAndCreateLambdaHandler(server, {
  context: async ({ event }) => {
    try {
      const req = { headers: event.headers };

      // Authenticate user
      await authMiddleware(req);

      // Ensure MongoDB is connected
      await db;

      // Pass authenticated user to resolvers
      return { user: req.user };
    } catch (err) {
      console.error("Context setup error:", err);
      throw new Error("Failed to set up context");
    }
  },
});
