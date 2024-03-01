import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const repostCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Check if the user has already reposted the collage
    const existingRepost = await User.findOne({
      _id: user._id,
      repostedCollages: collageId,
    });

    if (existingRepost) {
      throw new Error("Collage already reposted by the user.");
    }

    // Add the collage to the user's repostedCollages
    await User.findByIdAndUpdate(
      user._id,
      { $push: { repostedCollages: collageId } },
      { new: true }
    );

    // Add the user to the collage's reposts
    await Collage.findByIdAndUpdate(
      collageId,
      { $push: { reposts: user._id } },
      { new: true }
    );

    // Create a notification for the original author of the collage
    await createNotification({
      recipientId: collage.author,
      senderId: user._id,
      type: "COLLAGE_REPOST",
      collageId: collageId,
      message: `$reposted your collage.`,
    });

    return {
      success: true,
      message: "Collage reposted successfully.",
      action: "REPOST",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during reposting the collage.");
  }
};

export default repostCollage;
