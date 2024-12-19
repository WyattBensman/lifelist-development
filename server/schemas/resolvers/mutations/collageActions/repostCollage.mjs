import { User, Collage } from "../../../../models/index.mjs";
import { isUser, findCollageById } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const repostCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    // Verify the collage exists
    const collage = await findCollageById(collageId);

    // Add the collage to the user's repostedCollages and update the collage's reposts
    const updatedUser = await User.findByIdAndUpdate(
      user,
      { $addToSet: { repostedCollages: collageId } },
      { new: true }
    );

    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $addToSet: { reposts: user } },
      { new: true }
    );

    // Check if both updates were successful
    if (!updatedUser || !updatedCollage) {
      throw new Error("Failed to repost collage. Please try again.");
    }

    // Create a notification for the original author of the collage
    await createNotification({
      recipientId: collage.author,
      senderId: user,
      type: "COLLAGE_REPOST",
      collageId: collageId,
      message: `${user.fullName} reposted your collage.`,
    });

    return {
      success: true,
      message: "Collage successfully reposted.",
      collage: {
        _id: updatedCollage._id,
        coverImage: updatedCollage.coverImage,
        createdAt: updatedCollage.createdAt,
      },
    };
  } catch (error) {
    console.error(`Repost Collage Error: ${error.message}`);
    throw new Error("An error occurred during reposting the collage.");
  }
};

export default repostCollage;
