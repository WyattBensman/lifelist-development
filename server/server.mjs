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
import { resetCameraShots } from "./tasks/resetCameraShots.mjs";
import { cleanupExpiredRegistrations } from "./tasks/cleanupExpiredRegistrations.mjs";

// Initialize environment variables
dotenv.config();

// Construct directory base path from URL
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
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
console.log(`Upload Directory Path: ${uploadDir}`);

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

// HOME ACCESS
/* app.use(
  cors({
    origin: ["http://192.168.1.205:8081", "exp://192.168.1.205:8081"],
  })
); */

// MIDDLE POOL ACCESS
/* app.use(
  cors({
    origin: ["http://192.168.1.205:8081", "exp://192.168.1.79:8081"],
  })
); */

// POOL ACCESS
/* app.use(
  cors({
    origin: ["http://10.5.50.98:8081", "exp://10.5.50.98:8081"],
  })
); */

// SPARKMAN WHARF ACCESS
/* app.use(
  cors({
    origin: ["http://100.66.6.237:8081", "exp://100.66.6.237:8081"],
  })
); */

const startServer = async () => {
  await server.start();

  server.applyMiddleware({
    app,
    path: "/graphql",
  });

  /* if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));
    app.use("/images", express.static(path.join(__dirname, "/images")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  } */

  // Schedule jobs
  schedule.scheduleJob("0 0 * * *", cleanupExpiredRegistrations); // Runs daily at midnight
  schedule.scheduleJob("0 6 * * *", resetCameraShots); // Runs daily at 6 AM

  await db; // Ensure database connection is ready

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startServer();
