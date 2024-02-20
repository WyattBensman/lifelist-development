import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

export const postCollage = async (_, { collageId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Update the posted field and set the createdAt to the current date
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $set: { posted: true, createdAt: new Date() } },
      { new: true, runValidators: true }
    );

    return {
      message: "Collage posted successfully.",
      updatedCollage,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while posting the collage.");
  }
};
