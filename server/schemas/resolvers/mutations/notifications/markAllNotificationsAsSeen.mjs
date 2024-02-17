import { Notification } from "../../../../models/index.mjs";

export const markAllNotificationsAsSeen = async (userId) => {
  try {
    const updatedNotifications = await Notification.updateMany(
      { recipient: userId },
      { $set: { read: true } },
      { new: true }
    );

    return {
      message: "All notifications marked as seen.",
    };
  } catch (error) {
    console.error(`Error marking all notifications as seen: ${error.message}`);
    throw new Error("An error occurred during marking notifications as seen.");
  }
};
