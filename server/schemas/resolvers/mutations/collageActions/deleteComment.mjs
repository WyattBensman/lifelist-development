import { Collage, Comment } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteComment = async (_, { collageId, commentId }, { user }) => {
  try {
    isUser(user);
    const collage = await findCollageById(collageId);
    const comment = await findCommentById(commentId);

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
