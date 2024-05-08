import { Collage, Comment } from "../../../../models/index.mjs";
import { findCollageById, isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const createComment = async (_, { collageId, text }, { user }) => {
  try {
    isUser(user);

    // Verify the collage exists
    await findCollageById(collageId);

    // Create a new comment and add it to the database
    const newComment = await Comment.create({
      author: user._id,
      text,
      createdAt: new Date(),
    });

    // Update the collage's comment list
    const collage = await Collage.findByIdAndUpdate(collageId, {
      $addToSet: { comments: newComment._id },
    });

    // Send notification to the collage author
    await createNotification({
      recipientId: collage.author,
      senderId: user._id,
      type: "COMMENT",
      collageId,
      message: `${user.fullName} commented on your collage.`,
    });

    return {
      success: true,
      message: "Comment successfully created.",
      action: "COMMENT",
    };
  } catch (error) {
    console.error(`Create Comment Error: ${error.message}`);
    throw new Error("An error occurred during comment creation.");
  }
};

export default createComment;
