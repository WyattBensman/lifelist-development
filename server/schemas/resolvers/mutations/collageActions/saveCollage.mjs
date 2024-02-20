import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const saveCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Check if the user has already saved the collage
    if (user.savedCollages.includes(collage.id)) {
      throw new Error("Collage already saved by the user.");
    }

    // Add the collage to the user's savedCollages
    await User.findByIdAndUpdate(
      user.id,
      { $push: { savedCollages: collage.id } },
      { new: true }
    );

    return {
      message: "Collage saved successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during saving the collage.");
  }
};
