import { Notification } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const markAllNotificationsAsSeen = async (_, __, { user }) => {
  try {
    isUser(user);

    // Update all unread notifications to 'read' status for the current user
    await Notification.updateMany(
      { recipient: user._id, read: false },
      { $set: { read: true } }
    );

    return {
      success: true,
      message: "All notifications marked as seen.",
    };
  } catch (error) {
    console.error(`Error marking notifications as seen: ${error.message}`);
    throw new Error("Failed to mark notifications as seen.");
  }
};

export default markAllNotificationsAsSeen;
