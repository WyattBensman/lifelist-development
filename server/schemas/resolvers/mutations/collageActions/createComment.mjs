import { Collage, Comment } from "../../../../models/index.mjs";
import { findCollageById, isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const createComment = async (_, { collageId, text }, { user }) => {
  try {
    isUser(user);
    const collage = await findCollageById(collageId);

    const newComment = await Comment.create({
      author: user._id,
      text,
      createdAt: new Date(),
    });

    await Collage.findByIdAndUpdate(collageId, {
      $addToSet: { comments: newComment },
    });

    await createNotification({
      recipientId: collage.author,
      senderId: user._id,
      type: "COMMENT",
      collageId: collageId,
      message: `${user._id} commented on your collage.`,
    });

    return {
      success: true,
      message: "Comment created successfully",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during comment creation.");
  }
};

export default createComment;
