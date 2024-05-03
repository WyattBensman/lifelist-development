import { User, Collage } from "../../../../models/index.mjs";
import { isUser, findCollageById } from "../../../../utils/auth.mjs";

const archiveCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    // Verify the collage exists
    await findCollageById(collageId);

    // Update user's archived collages to prevent duplicates
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { archivedCollages: collageId } },
      { new: true }
    );

    // Mark the collage as archived
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $set: { archived: true } },
      { new: true }
    );

    // Ensure both updates were successful
    if (!updatedUser || !updatedCollage) {
      throw new Error("Failed to archive collage. Please try again.");
    }

    return {
      success: true,
      message: "Collage successfully archived.",
      action: "ARCHIVE",
    };
  } catch (error) {
    console.error(`Archive Collage Error: ${error.message}`);
    throw new Error("An error occurred during archiving the collage.");
  }
};

export default archiveCollage;
