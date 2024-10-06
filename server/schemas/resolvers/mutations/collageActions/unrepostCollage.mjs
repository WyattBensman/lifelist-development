import { User, Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { findCollageById } from "../../../../utils/auth.mjs";

const unrepostCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    // Verify the collage exists
    await findCollageById(collageId);

    // Remove the collage from the user's repostedCollages
    const updatedUser = await User.findByIdAndUpdate(
      user,
      { $pull: { repostedCollages: collageId } },
      { new: true }
    );

    // Remove the user from the collage's reposts
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $pull: { reposts: user } },
      { new: true }
    );

    // Check if both updates were successful
    if (!updatedUser || !updatedCollage) {
      throw new Error("Failed to unrepost collage. Please try again.");
    }

    return {
      success: true,
      message: "Collage successfully unreposted.",
      action: "UNREPOST",
    };
  } catch (error) {
    console.error(`Unrepost Collage Error: ${error.message}`);
    throw new Error("An error occurred during unreposting the collage.");
  }
};

export default unrepostCollage;
