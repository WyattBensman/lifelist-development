import { Collage, Comment } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteComment = async (_, { collageId, commentId }, { user }) => {
  try {
    isUser(user);

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found.");
    }

    // Find the collage by its ID
    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Check if the current user is either the author of the comment or the creator of the collage
    if (
      comment.author.toString() !== user._id &&
      collage.author.toString() !== user._id
    ) {
      throw new Error("Not authorized to delete this comment.");
    }

    // Use $pull to remove the comment from the comments array
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $pull: { comments: commentId } },
      { new: true }
    ).populate({
      path: "comments",
      populate: {
        path: "author",
        select: "_id username profilePicture",
      },
    });

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return {
      success: true,
      message: "Comment deleted successfully",
      comments: updatedCollage.comments,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during comment deletion.");
  }
};

export default deleteComment;
