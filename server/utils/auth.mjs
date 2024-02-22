import jwt from "jsonwebtoken";
import { promisify } from "util";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";
dotenv.config();

const expiration = "365d";
const secret = process.env.JWT_SECRET || "mysecretssshhhhhhh";

// Custom error for authentication failures
export const AuthenticationError = new GraphQLError(
  "Could not authenticate user.",
  {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }
);

// Middleware to handling authentication
export const authMiddleware = async function ({ req }) {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const verifyToken = promisify(jwt.verify);
    const { data } = await verifyToken(token, secret, { maxAge: expiration });
    req.user = data;
  } catch (error) {
    console.log("Invalid token");
  }

  return req;
};

// Function to generate JWT token
export const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: expiration,
  });
  return token;
};

// Check to see if a current user
export const isUser = (user) => {
  if (!user) {
    throw new AuthenticationError("User not authenticated");
  }
};

// Check to see if the user is authenticated & is the Curent User
export const isCurrentUser = (user, userId) => {
  if (!user) {
    throw new AuthenticationError("User not authenticated");
  }

  // Check if the user is the current user
  if (user.id !== userId) {
    throw new AuthenticationError("Not authorized to perform this action");
  }
};

// Check to see if the user is authenticated & is the Author
export const isCurrentAuthor = (user, authorId) => {
  if (!user) {
    throw new AuthenticationError("User not authenticated");
  }

  // Check if the current user is the author
  if (user.id !== authorId) {
    throw new AuthenticationError("Not authorized to perform this action");
  }
};
