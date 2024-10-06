import { isUser, findCommentById } from "../../../../utils/auth.mjs";

const reportComment = async (_, { commentId, reason }, { user }) => {
  try {
    isUser(user);

    // Verify the comment exists
    const comment = await findCommentById(commentId);

    // Check if the reporter has already reported the comment
    const alreadyReported = comment.reports.some(
      (report) => report.reporter.toString() === user.toString()
    );
    if (alreadyReported) {
      throw new Error("You have already reported this comment.");
    }

    // Update the reports field of the comment with the new report
    comment.reports.push({ reporter: user, reason });
    await comment.save();

    return {
      success: true,
      message: "Comment successfully reported.",
      action: "REPORT_COMMENT",
    };
  } catch (error) {
    console.error(`Report Comment Error: ${error.message}`);
    throw new Error("An error occurred during comment reporting.");
  }
};

export default reportComment;
