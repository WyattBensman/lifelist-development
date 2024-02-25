import { Collage, Comment } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteComment = async (_, { collageId, commentId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Find the comment by its ID
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      throw new Error("Comment not found.");
    }

    // Check if the current user is either the author of the comment or the creator of the collage
    if (
      comment.author.toString() !== user._id &&
      collage.author.toString() !== user._id
    ) {
      throw new Error("Not authorized to delete this comment.");
    }

    // Use $pull to remove the comment from the comments array
    await Collage.findByIdAndUpdate(
      collageId,
      { $pull: { comments: commentId } },
      { new: true }
    );

    return {
      message: "Comment deleted successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during comment deletion.");
  }
};

export default deleteComment;
