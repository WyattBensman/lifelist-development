import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const followUser = async (_, { userIdToFollow }, { user }) => {
  try {
    isUser(user);

    // Update the user's following list
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { following: userIdToFollow } },
      { new: true }
    );

    // Update the followed user's followers list
    await User.findByIdAndUpdate(
      userIdToFollow,
      { $addToSet: { followers: user._id } },
      { new: true }
    );

    // Create a notification for the user being followed
    await createNotification({
      recipientId: userIdToFollow,
      senderId: user._id,
      type: "FOLLOW",
      message: `${user.fullName} started following you.`,
    });

    return {
      success: true,
      message: "User followed successfully.",
      action: "FOLLOW",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during follow action.");
  }
};

export default followUser;
