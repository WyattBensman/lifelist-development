import { User, Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { findCollageById } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const likeCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    // Verify the collage exists
    const collage = await findCollageById(collageId);

    // Update user's liked collages to prevent duplicates
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { likedCollages: collageId } },
      { new: true }
    );

    // Update collage's liked users list to prevent duplicates
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $addToSet: { likes: user._id } },
      { new: true }
    );

    // Ensure both updates were successful
    if (!updatedUser || !updatedCollage) {
      throw new Error("Failed to like collage. Please try again.");
    }

    // Create a notification for the original author of the collage
    await createNotification({
      recipientId: collage.author,
      senderId: user._id,
      type: "COLLAGE_LIKE",
      collageId: collageId,
      message: `${user.fullName} liked your collage.`,
    });

    return {
      success: true,
      message: "Collage successfully liked.",
      action: "LIKE",
    };
  } catch (error) {
    console.error(`Like Collage Error: ${error.message}`);
    throw new Error("An error occurred during liking the collage.");
  }
};

export default likeCollage;
