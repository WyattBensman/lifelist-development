import jwt from "jsonwebtoken";
import { promisify } from "util";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";
dotenv.config();

const expiration = "12M";
const secret = process.env.JWT_SECRET || "defaultSecret";

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
export const generateToken = (userId, secret, expiration) => {
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: expiration,
  });
  return token;
};
