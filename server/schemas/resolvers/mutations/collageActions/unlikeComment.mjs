import { Comment } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const unlikeComment = async (_, { commentId }, { user }) => {
  try {
    isUser(user);

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    await comment.unlike(user._id);

    return {
      success: true,
      message: "Comment unliked successfully",
      action: "UNLIKE",
    };
  } catch (error) {
    console.error(`Unlike Comment Error: ${error.message}`);
    return {
      success: false,
      message: error.message,
      action: "UNLIKE",
    };
  }
};

export default unlikeComment;
