// mutations/collageMutations.mjs

import { Collage, User } from "../models/index.mjs";
import { isUser } from "../utils/auth.mjs";

export const reportComment = async (
  _,
  { collageId, commentId, reason },
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

    // Report the comment (you can customize this part based on your reporting logic)
    comment.reports.push({
      reporter: user.id,
      reason,
    });

    await collage.save();

    return {
      message: "Comment reported successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during comment reporting.");
  }
};
