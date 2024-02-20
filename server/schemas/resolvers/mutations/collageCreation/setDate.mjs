import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

export const setDate = async (_, { collageId, date }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Update date for the collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $set: { date } },
      { new: true, runValidators: true }
    );

    return {
      message: "Date set successfully.",
      updatedCollage,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while setting the date.");
  }
};
