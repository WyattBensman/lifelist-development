import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const sendFollowRequest = async (_, { userIdToFollow }, { user }) => {
  try {
    isUser(user);

    // Check if any friend request already exists
    const alreadyHasFriendRequest = await User.findOne({
      _id: userIdToFollow,
      "followerRequests.userId": user._id,
    });

    // Check if user is already following
    const isAlreadyFollowing = await User.findOne({
      _id: user._id,
      following: userIdToFollow,
    });

    if (alreadyHasFriendRequest || isAlreadyFollowing) {
      throw new Error(
        "A friend request already exists, or user is already being followed."
      );
    }

    // Update the user's followerRequests list
    const updatedUser = await User.findByIdAndUpdate(
      userIdToFollow,
      {
        $addToSet: {
          followRequests: {
            userId: user._id,
            status: "PENDING",
          },
        },
      },
      { new: true }
    );

    // Create a notification for the recipient
    await createNotification({
      recipientId: userIdToFollow,
      senderId: user._id,
      type: "FRIEND_REQUEST",
      message: `${user.fullName} sent you a friend request.`,
    });

    return {
      success: true,
      status: "PENDING",
      message: "Follow request sent.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during sending follow request.");
  }
};

export default sendFollowRequest;
