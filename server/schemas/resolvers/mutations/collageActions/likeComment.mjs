import { Comment } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const likeComment = async (_, { commentId }, { user }) => {
  try {
    isUser(user);

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    await comment.like(user._id);

    return {
      success: true,
      message: "Comment liked successfully",
      action: "LIKE",
    };
  } catch (error) {
    console.error(`Like Comment Error: ${error.message}`);
    return {
      success: false,
      message: error.message,
      action: "LIKE",
    };
  }
};

export default likeComment;
