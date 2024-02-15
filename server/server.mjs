import express from "express";
import { ApolloServer } from "apollo-server-express";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import path from "path";
import { authMiddleware } from "./utils/auth.mjs";
import typeDefs from "./schemas/typeDefs.mjs";
/* import resolvers from "./schemas/resolvers.mjs"; */
// Resolvers
import {
  userQueries,
  cameraQueries,
  collageQueries,
  experienceQueries,
} from "./resolvers/queries/index.mjs";

import db from "./config/connection.mjs";
import dotenv from "dotenv";

dotenv.config();

import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false,
  context: authMiddleware,
});

// Apply the middleware to handle file uploads
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const startServer = async () => {
  await server.start();

  // Start the Apollo Server and then apply middleware
  server.applyMiddleware({
    app,
    path: "/graphql",
    context: authMiddleware,
  });

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.use("/images", express.static(path.join(__dirname, "/images")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  // Connect to MongoDB
  await db;

  // Start the server
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startServer();
