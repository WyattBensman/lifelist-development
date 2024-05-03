import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const setCaption = async (_, { collageId, caption }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Update the caption of the specified collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { caption },
      { new: true }
    );

    // Check if the collage exists
    if (!updatedCollage) {
      throw new Error("Collage not found.");
    }

    // Return success message with the updated collage ID
    return {
      success: true,
      message: "Description added successfully",
      collageId: updatedCollage._id,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during adding description.");
  }
};

export default setCaption;
