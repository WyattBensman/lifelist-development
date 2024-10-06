import { isUser, findCommentById } from "../../../../utils/auth.mjs";

const editComment = async (_, { commentId, newText }, { user }) => {
  try {
    isUser(user);

    // Verify the comment exists
    const comment = await findCommentById(commentId);

    // Check if the current user is the author of the comment
    if (comment.author.toString() !== user) {
      throw new Error("Not authorized to edit this comment.");
    }

    // Update the comment with the new text
    comment.text = newText;
    await comment.save();

    return {
      success: true,
      message: "Comment successfully edited.",
      action: "EDIT_COMMENT",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during comment editing.");
  }
};

export default editComment;
