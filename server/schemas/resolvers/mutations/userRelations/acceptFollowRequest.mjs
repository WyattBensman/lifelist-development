import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const acceptFollowRequest = async (_, { userIdToAccept }, { user }) => {
  try {
    isUser(user);

    // Update the user's following list and the follower's followers list
    const updatedUser = await User.findByIdAndUpdate(
      userIdToAccept,
      {
        $addToSet: { following: user._id },
      },
      { new: true }
    );

    // Update the follower's followers list
    await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: { followers: userIdToAccept },
        $pull: { followRequests: { userId: userIdToAccept } },
      },
      { new: true }
    );

    // Fetch the user object using userIdToAccept
    const acceptedUser = await User.findById(userIdToAccept);

    if (!acceptedUser) {
      throw new Error("User not found.");
    }

    // Create a notification for the current user indicating a new follower
    await createNotification({
      recipientId: user._id,
      senderId: userIdToAccept,
      type: "FOLLOW",
      message: `${acceptedUser.fullName} is now following you.`,
    });

    return {
      success: true,
      status: "ACCEPTED",
      message: "Follow request accepted.",
      followRequests: updatedUser.followRequests,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during accepting follow request.");
  }
};

export default acceptFollowRequest;
