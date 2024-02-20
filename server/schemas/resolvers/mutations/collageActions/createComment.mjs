import { Collage } from "../models/index.mjs";
import { isUser } from "../utils/auth.mjs";

export const createComment = async (_, { collageId, text }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the collage exists
    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Create a new comment
    const newComment = {
      user: user.id,
      text,
      createdAt: new Date(),
    };

    // Add the comment to the collage
    collage.comments.push(newComment);
    await collage.save();

    return {
      message: "Comment created successfully.",
      comment: newComment,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during comment creation.");
  }
};
