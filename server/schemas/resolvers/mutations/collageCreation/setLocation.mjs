import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const setLocation = async (_, { collageId, locations }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Add locations to the specified collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $addToSet: { locations: { $each: locations } } },
      { new: true, runValidators: true }
    );

    // Check if the collage exists
    if (!updatedCollage) {
      throw new Error("Collage not found.");
    }

    // Return success message with the collage ID
    return {
      success: true,
      message: "Location set successfully",
      collageId: collageId,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while setting the locations.");
  }
};

export default setLocation;
