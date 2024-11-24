import jwt from "jsonwebtoken";
import { promisify } from "util";
import dotenv from "dotenv";
import { Collage, LifeList, PrivacyGroup, Comment } from "../models/index.mjs";
import { AuthenticationError } from "apollo-server-errors";
dotenv.config();

const expiration = "365d";
const secret = process.env.JWT_SECRET || "mysecretssshhhhhhh";
const verifyToken = promisify(jwt.verify);

export { AuthenticationError };

export const authMiddleware = async function (req) {
  console.log("Req:", req);

  let token =
    req.headers.authorization?.split(" ")[1] ||
    req.body.token ||
    req.query.token;

  console.log("Authorization Header:", req.headers.authorization); // Log raw header
  console.log("Extracted Token:", token); // Log extracted token

  if (!token) {
    console.error("No token provided");
    return req;
  }

  try {
    const decoded = await verifyToken(token, secret, { maxAge: expiration });
    console.log("Decoded Token:", decoded); // Log decoded details
    req.user = decoded.id; // Assuming the token contains a user ID at 'id'
  } catch (error) {
    console.error(`Invalid token: ${error.message}`);
    req.user = null;
  }

  return req;
};

export const generateToken = (userId) =>
  jwt.sign({ id: userId }, secret, { expiresIn: expiration });

const ensureAuthenticatedUser = (user) => {
  console.log(user);
  if (!user) {
    throw new AuthenticationError(`User not authenticateddddd ${user}`);
  }
};

export const isUser = ensureAuthenticatedUser;

export const isCurrentUser = (user, userId) => {
  ensureAuthenticatedUser(user);
  if (user !== userId) {
    throw new AuthenticationError("Not authorized to perform this action");
  }
};

export const isCurrentAuthor = async (user, collageId) => {
  ensureAuthenticatedUser(user);
  const collage = await Collage.findById(collageId);
  if (!collage || user.toString() !== collage.author.toString()) {
    throw new AuthenticationError("Not authorized to perform this action");
  }
};

export const isCurrentLifeListAuthor = async (user, lifeListId) => {
  ensureAuthenticatedUser(user);
  const lifeList = await LifeList.findById(lifeListId);
  if (!lifeList || user.toString() !== lifeList.author.toString()) {
    throw new AuthenticationError("Not authorized to perform this action");
  }
};

export const isCurrentPrivacyGroupAuthor = async (user, privacyGroupId) => {
  ensureAuthenticatedUser(user);
  const privacyGroup = await PrivacyGroup.findById(privacyGroupId);
  if (!privacyGroup || privacyGroup.author.toString() !== user.toString()) {
    throw new AuthenticationError(
      "User is not authorized to edit this privacy group."
    );
  }
};

export const isLifeListAuthor = async (user, lifeListId) => {
  ensureAuthenticatedUser(user);
  const lifeList = await LifeList.findById(lifeListId);
  if (!lifeList || user.toString() !== lifeList.author.toString()) {
    throw new AuthenticationError("Not authorized to perform this action");
  }
};

export const findCollageById = async (collageId) => {
  const collage = await Collage.findById(collageId);
  if (!collage) {
    throw new Error("Collage not found.");
  }
  return collage;
};

export const findCommentById = async (commentId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error("Comment not found.");
  }
  return comment;
};

/* export const authMiddleware = async function ({ req }) {
  let token = req.body.token || req.query.token || req.headers.authorization;
  if (req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    token = parts.length === 2 ? parts[1].trim() : null;
  }

  if (!token) {
    return req;
  }

  try {
    const { data } = await verifyToken(token, secret, { maxAge: expiration });
    req.user = data;
  } catch (error) {
    console.log(`Invalid token: ${error.message}`);
  }

  return req;
}; */
