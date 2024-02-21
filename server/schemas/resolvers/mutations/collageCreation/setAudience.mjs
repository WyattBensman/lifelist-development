import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

export const setAudience = async (_, { collageId, audience }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Update audience for the collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $set: { audience } },
      { new: true, runValidators: true }
    );

    return updatedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while setting the audience.");
  }
};
