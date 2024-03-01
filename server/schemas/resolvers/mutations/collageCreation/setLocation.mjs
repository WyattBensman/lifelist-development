import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const setLocation = async (_, { collageId, locations }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author
    await isCurrentAuthor(user, collageId);

    // Update locations for the collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $addToSet: { locations: { $each: locations } } },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      message: "Location set successfully",
      collageId: collageId,
      locations: updatedCollage.locations,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while setting the locations.");
  }
};

export default setLocation;
