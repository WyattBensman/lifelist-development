import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const saveCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Check if the user has already saved the collage
    const existingSave = await User.findOne({
      _id: user._id,
      savedCollages: collageId,
    });

    if (existingSave) {
      throw new Error("Collage already saved by the user.");
    }

    // Add the collage to the user's savedCollages
    await User.findByIdAndUpdate(
      user._id,
      { $push: { savedCollages: collageId } },
      { new: true }
    );

    // Add the user to the collage's saves
    await Collage.findByIdAndUpdate(
      collageId,
      { $push: { saves: user._id } },
      { new: true }
    );

    return {
      success: true,
      message: "Collage saved successfully.",
      action: "SAVE",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during saving the collage.");
  }
};

export default saveCollage;
