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
    const existingSave = await User.findOne({
      _id: user._id,
      savedCollages: collageId,
    });

    if (!existingSave) {
      throw new Error("Collage not saved by the user.");
    }

    // Remove the collage from the user's savedCollages
    await User.findByIdAndUpdate(
      user._id,
      { $pull: { savedCollages: collageId } },
      { new: true }
    );

    // Remove the user from the collage's saves
    await Collage.findByIdAndUpdate(
      collageId,
      { $pull: { saves: user._id } },
      { new: true }
    );

    return {
      success: true,
      message: "Collage unsaved successfully.",
      action: "UNSAVE",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during unsaving the collage.");
  }
};

export default unsaveCollage;
