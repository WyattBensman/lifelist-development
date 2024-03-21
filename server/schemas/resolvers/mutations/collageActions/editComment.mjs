import { Collage, Comment } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const editComment = async (_, { collageId, commentId, newText }, { user }) => {
  try {
    isUser(user);

    // Check if the collage exists
    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Find the comment by its _id using the Comment model
    const comment = await Comment.findById(commentId);

    // Check if the comment was found
    if (!comment) {
      throw new Error("Comment not found.");
    }

    // Check if the current user is the author of the comment
    if (comment.author.toString() !== user._id) {
      throw new Error("Not authorized to edit this comment.");
    }

    // Update the comment with the new text
    comment.text = newText;

    // Save the updated comment
    const updatedComment = await comment.save();

    // Query all comments of the collage after the edit
    const allComments = await Comment.find({ collage: collageId });

    return {
      success: true,
      message: "Comment edited successfully",
      comments: allComments,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during comment editing.");
  }
};

export default editComment;
