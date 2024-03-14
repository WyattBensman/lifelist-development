import { Comment } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const reportComment = async (_, { commentId, reason }, { user }) => {
  try {
    /* isUser(user); */

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if the reporter has already reported the comment
    const alreadyReported = comment.reports.some(
      (report) => report.reporter.toString() === "65e72e4e82f12a087695250d"
    );
    if (alreadyReported) {
      throw new Error("You have already reported this comment");
    }

    // Update the reports field of the comment with the new report
    comment.reports.push({ reporter: "65e72e4e82f12a087695250d", reason });
    await comment.save();

    return {
      success: true,
      message: "Comment reported successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during comment reporting.");
  }
};

export default reportComment;
