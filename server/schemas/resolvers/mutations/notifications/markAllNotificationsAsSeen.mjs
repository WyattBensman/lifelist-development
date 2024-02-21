import { Notification } from "../../../../models/index.mjs";

const markAllNotificationsAsSeen = async (userId) => {
  try {
    const updatedNotifications = await Notification.updateMany(
      { recipient: userId },
      { $set: { read: true } },
      { new: true }
    );

    return updatedNotifications;
  } catch (error) {
    console.error(`Error marking all notifications as seen: ${error.message}`);
    throw new Error("An error occurred during marking notifications as seen.");
  }
};

export default markAllNotificationsAsSeen;
