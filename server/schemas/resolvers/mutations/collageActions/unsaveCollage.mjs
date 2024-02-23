import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const unsaveCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Check if the user has saved the collage
    if (!user.savedCollages.includes(collageId)) {
      throw new Error("Collage not saved by the user.");
    }

    // Remove the collage from the user's savedCollages
    await User.findByIdAndUpdate(
      user._id,
      { $pull: { savedCollages: collageId } },
      { new: true }
    );

    return {
      message: "Collage unsaved successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during unsaving the collage.");
  }
};

export default unsaveCollage;
