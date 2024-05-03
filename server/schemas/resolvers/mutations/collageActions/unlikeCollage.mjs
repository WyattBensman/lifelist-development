import { User, Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { findCollageById } from "../../../../utils/auth.mjs";

const unlikeCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    // Verify the collage exists
    await findCollageById(collageId);

    // Remove the collage from user's liked list
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { likedCollages: collageId } },
      { new: true }
    );

    // Remove the user from collage's liked users list
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $pull: { likes: user._id } },
      { new: true }
    );

    // Ensure both updates were successful
    if (!updatedUser || !updatedCollage) {
      throw new Error("Failed to unlike collage. Please try again.");
    }

    return {
      success: true,
      message: "Collage successfully unliked.",
      action: "UNLIKE",
    };
  } catch (error) {
    console.error(`Unlike Collage Error: ${error.message}`);
    throw new Error("An error occurred during unliking the collage.");
  }
};

export default unlikeCollage;
