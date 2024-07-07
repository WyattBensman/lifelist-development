import { Comment } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const unlikeComment = async (_, { commentId }, { user }) => {
  try {
    isUser(user);

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $pull: { likedBy: user._id },
        $inc: { likes: -1 },
      },
      { new: true }
    );

    if (!comment) {
      throw new Error("Comment not found");
    }

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
