import { Collage, Comment } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

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
      author: "65d762da8d7b7d7105af76b3",
      text,
      createdAt: new Date(),
    });

    // Use $addToSet to add the new comment to the comments array without duplicates
    await Collage.findByIdAndUpdate(
      collageId,
      { $addToSet: { comments: newComment } },
      { new: true }
    );

    return newComment;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during comment creation.");
  }
};

export default createComment;
