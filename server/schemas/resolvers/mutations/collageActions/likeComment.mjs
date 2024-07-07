import { Comment } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const likeComment = async (_, { commentId }, { user }) => {
  try {
    isUser(user);

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $addToSet: { likedBy: user._id },
        $inc: { likes: 1 },
      },
      { new: true }
    );

    if (!comment) {
      throw new Error("Comment not found");
    }

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
