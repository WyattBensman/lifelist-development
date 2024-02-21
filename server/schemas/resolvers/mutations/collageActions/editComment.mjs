import { Collage } from "../models/index.mjs";
import { isUser } from "../utils/auth.mjs";

export const editComment = async (
  _,
  { collageId, commentId, newText },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the collage exists
    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Find the comment by its ID
    const comment = collage.comments.id(commentId);
    if (!comment) {
      throw new Error("Comment not found.");
    }

    // Check if the current user is the author of the comment
    if (comment.user.toString() !== user.id) {
      throw new Error("Not authorized to edit this comment.");
    }

    // Update the comment text
    comment.text = newText;
    await collage.save();

    const updatedComment = collage.comments.id(commentId).toObject();

    return updatedComment;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during comment editing.");
  }
};
