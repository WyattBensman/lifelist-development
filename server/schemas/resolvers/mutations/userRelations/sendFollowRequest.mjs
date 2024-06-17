import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const sendFollowRequest = async (_, { userIdToFollow }, { user }) => {
  try {
    isUser(user);

    // Check for existing follow request or current following status
    const targetUser = await User.findById(userIdToFollow);
    if (!targetUser) {
      throw new Error("User not found.");
    }

    const alreadyRequested = targetUser.followRequests.some((request) =>
      request.userId.equals(user._id)
    );
    const isFollowing = targetUser.followers.includes(user._id);

    if (alreadyRequested || isFollowing) {
      throw new Error(
        "Follow request already sent or user is already followed."
      );
    }

    // Update the followRequests list of the target user
    await User.findByIdAndUpdate(
      userIdToFollow,
      {
        $addToSet: { followRequests: { userId: user._id, status: "PENDING" } },
      },
      { new: true }
    );

    // Send a notification for the follow request
    await createNotification({
      recipientId: userIdToFollow,
      senderId: user._id,
      type: "FOLLOW_REQUEST",
      message: `has sent you a follow request.`,
    });

    return {
      success: true,
      message: "Follow request successfully sent.",
    };
  } catch (error) {
    console.error(`Send Follow Request Error: ${error.message}`);
    throw new Error("Unable to send follow request due to a server error.");
  }
};

export default sendFollowRequest;
