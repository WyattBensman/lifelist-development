import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { findCollageById } from "../../../../utils/auth.mjs";

const saveCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    // Verify the collage exists
    await findCollageById(collageId);

    // Update the user's savedCollages and collage's saves using $addToSet to prevent duplicates
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { savedCollages: collageId } },
      { new: true }
    );

    // Add the user to the collage's saves
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $addToSet: { saves: user._id } },
      { new: true }
    );

    // Check if both updates were successful
    if (!updatedUser || !updatedCollage) {
      throw new Error("Update failed, please try again.");
    }

    return {
      success: true,
      message: "Collage successfully saved.",
      action: "SAVE",
    };
  } catch (error) {
    console.error(`Save Collage Error: ${error.message}`);
    throw new Error("An error occurred during saving the collage.");
  }
};

export default saveCollage;
