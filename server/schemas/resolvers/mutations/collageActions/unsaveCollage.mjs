import { User, Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { findCollageById } from "../../../../utils/auth.mjs";

const unsaveCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    // Verify the collage exists
    await findCollageById(collageId);

    // Remove collage from user's saved list
    await User.findByIdAndUpdate(user._id, {
      $pull: { savedCollages: collageId },
    });

    // Remove user from collage's saved users
    await Collage.findByIdAndUpdate(collageId, { $pull: { saves: user._id } });

    return {
      success: true,
      message: "Collage successfully unsaved.",
      action: "UNSAVE",
    };
  } catch (error) {
    console.error(`Unsave Collage Error: ${error.message}`);
    throw new Error("An error occurred during unsaving the collage.");
  }
};

export default unsaveCollage;
