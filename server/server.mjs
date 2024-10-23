// Core and third-party modules
import express from "express";
import { ApolloServer } from "apollo-server-express";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import path from "path";
import schedule from "node-schedule";
import dotenv from "dotenv";
import * as url from "url";
import cors from "cors";
import fs from "fs";

// Configuration and utilities
import { authMiddleware } from "./utils/auth.mjs";
import db from "./config/connection.mjs";

// GraphQL schema definitions
import typeDefs from "./schemas/typeDefs.mjs";
import resolvers from "./schemas/resolvers.mjs";

// Scheduled tasks
import { resetDailyCameraShots } from "./tasks/resetDailyCameraShots.mjs";
import { transferShotsAfter24Hours } from "./tasks/transferShotsAfter24Hours.mjs";
import { checkReadyToReviewShots } from "./tasks/checkReadyToReviewShots.mjs";

// Initialize environment variables
dotenv.config();

// Construct directory base path from URL
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection
  playground: true, // Enable GraphQL Playground in production
  uploads: false, // Ensure file uploads are handled by graphql-upload
  context: async ({ req }) => {
    await authMiddleware(req);
    return { user: req.user };
  },
});

// Middleware for file uploads
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 12 }));

// Directory paths
const uploadDir = path.join(__dirname, "/uploads");

// Verify if the directory exists and is writable
try {
  if (!fs.existsSync(uploadDir)) {
    console.log("Upload directory does not exist. Creating directory...");
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Upload directory created.");
  } else {
    console.log("Upload directory exists.");
  }

  // Check if the directory is writable
  fs.accessSync(uploadDir, fs.constants.W_OK);
  console.log("Upload directory is writable.");
} catch (error) {
  console.error(`Directory access error: ${error.message}`);
}

// Static directory setup
app.use("/uploads", express.static(uploadDir));

// Universal CORS configuration
app.use(cors());

const startServer = async () => {
  try {
    await server.start();

    server.applyMiddleware({
      app,
      path: "/graphql",
    });

    // Schedule reset of camera shots at 4 AM daily
    schedule.scheduleJob("0 4 * * *", resetDailyCameraShots); // Reset camera shots at 4 AM

    // Schedule the new background tasks
    schedule.scheduleJob("*/30 * * * *", checkReadyToReviewShots); // Runs every 30 minutes
    schedule.scheduleJob("0 */3 * * *", transferShotsAfter24Hours); // Runs every 3 hours

    await db; // Ensure database connection is ready

    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
  }
};

startServer();
