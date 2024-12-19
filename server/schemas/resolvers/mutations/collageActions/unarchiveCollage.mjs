import { User, Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const unarchiveCollage = async (_, { collageId }, { user }) => {
  try {
    // Verify user authentication
    isUser(user);

    // Update the user's archived collages array
    const updatedUser = await User.findByIdAndUpdate(
      user,
      { $pull: { archivedCollages: collageId } },
      { new: true }
    );

    // Update the collage's archived status
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $set: { archived: false } },
      { new: true } // Return the updated collage
    );

    if (!updatedUser || !updatedCollage) {
      throw new Error("Failed to unarchive collage.");
    }

    return {
      success: true,
      message: "Collage successfully unarchived.",
      collage: {
        _id: updatedCollage._id,
        coverImage: updatedCollage.coverImage,
        createdAt: updatedCollage.createdAt,
      },
    };
  } catch (error) {
    console.error("Error unarchiving collage:", error.message);
    throw new Error("An error occurred while unarchiving the collage.");
  }
};

export default unarchiveCollage;
