import { Notification } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const markAllNotificationsAsSeen = async (_, __, { user }) => {
  try {
    isUser(user);

    // Find all notifications with the recipient being the current user & set read to true
    const notifications = await Notification.updateMany(
      { recipient: user._id },
      { $set: { read: true } }
    );

    return {
      success: true,
      message: "Notifications marked as seen successfully",
      action: "MARK_NOTIFICATIONS_AS_SEEN",
    };
  } catch (error) {
    console.error(`Error marking all notifications as seen: ${error.message}`);
    throw new Error("An error occurred during marking notifications as seen.");
  }
};

export default markAllNotificationsAsSeen;
