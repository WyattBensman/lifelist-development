import { Collage, Comment } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const createComment = async (_, { collageId, text }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the collage exists
    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Create a new comment instance
    const newComment = await Comment.create({
      author: user._id,
      text,
      createdAt: new Date(),
    });

    // Use $addToSet to add the new comment to the comments array without duplicates
    await Collage.findByIdAndUpdate(
      collageId,
      { $addToSet: { comments: newComment } },
      { new: true }
    );

    // Create a notification for the original author of the collage
    await createNotification({
      recipientId: collage.author,
      senderId: user._id,
      type: "COMMENTED",
      collageId: collageId,
      message: `${user.fullName} commented on your collage.`,
    });

    return newComment;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during comment creation.");
  }
};

export default createComment;
