import { Collage, Comment } from "../../../../models/index.mjs";
import {
  isUser,
  findCommentById,
  findCollageById,
} from "../../../../utils/auth.mjs";

const deleteComment = async (_, { commentId, collageId }, { user }) => {
  try {
    /* isUser(user); */

    // Verify the collage exists
    const collage = await findCollageById(collageId);

    // Verify the comment exists
    const comment = await findCommentById(commentId);

    // Ensure the current user is authorized to delete the comment (either comment author or collage author)
    /* if (
      comment.author.toString() !== user.toString() &&
      collage.author.toString() !== user.toString()
    ) {
      throw new Error("Not authorized to delete this comment.");
    } */

    // Delete the comment from the database
    await Comment.findByIdAndDelete(commentId);

    // Update the collage to remove the comment reference
    await Collage.findByIdAndUpdate(
      collageId,
      { $pull: { comments: commentId } },
      { new: true }
    );

    return {
      success: true,
      message: "Comment successfully deleted.",
      action: "DELETE_COMMENT",
    };
  } catch (error) {
    console.error(`Delete Comment Error: ${error.message}`);
    throw new Error("An error occurred during comment deletion.");
  }
};

export default deleteComment;
