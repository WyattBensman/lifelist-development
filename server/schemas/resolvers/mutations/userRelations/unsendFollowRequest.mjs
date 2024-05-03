import { User, Notification } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import deleteNotification from "../notifications/deleteNotification.mjs";

const unsendFollowRequest = async (_, { userIdToUnfollow }, { user }) => {
  try {
    isUser(user);

    // Check if the friend request exists
    const friendRequestExists = await User.findOne({
      _id: userIdToUnfollow,
      "followRequests.userId": user._id,
    });

    if (!friendRequestExists) {
      throw new Error("No friend request exists to unsend.");
    }

    // Optionally, find and delete the related notification
    const notification = await Notification.findOne({
      recipientId: userIdToUnfollow,
      senderId: user._id,
      type: "FOLLOW_REQUEST",
    });

    if (notification) {
      // Reuse the deleteNotification function
      await deleteNotification(
        _,
        { notificationId: notification._id },
        { user }
      );
    }

    // Remove the friend request from the recipient's list
    await User.findByIdAndUpdate(
      userIdToUnfollow,
      {
        $pull: { followRequests: { userId: user._id } },
      },
      { new: true }
    );

    return {
      success: true,
      message: "Follow request unsent successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during unsending follow request.");
  }
};

export default unsendFollowRequest;
