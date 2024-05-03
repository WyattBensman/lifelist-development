import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const followUser = async (_, { userIdToFollow }, { user }) => {
  try {
    isUser(user);

    // Updates current user's following list to include the new user
    await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { following: userIdToFollow } },
      { new: true }
    );

    // Updates the followed user's followers list to include the current user
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
      message: "User successfully followed.",
    };
  } catch (error) {
    console.error(`Follow User Error: ${error.message}`);
    throw new Error("Unable to complete follow action due to a server error.");
  }
};

export default followUser;
