import { User, Collage } from "../../../../models/index.mjs";
import { isUser, findCollageById } from "../../../../utils/auth.mjs";

const unarchiveCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Verify the collage exists
    await findCollageById(collageId);

    // Remove the collage from user's archived list
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { archivedCollages: collageId } },
      { new: true }
    );

    // Mark the collage as not archived
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $set: { archived: false } },
      { new: true }
    );

    // Ensure both updates were successful
    if (!updatedUser || !updatedCollage) {
      throw new Error("Failed to unarchive collage. Please try again.");
    }

    return {
      success: true,
      message: "Collage successfully unarchived.",
      action: "UNARCHIVE",
    };
  } catch (error) {
    console.error(`Unarchive Collage Error: ${error.message}`);
    throw new Error("An error occurred during unarchiving the collage.");
  }
};

export default unarchiveCollage;
