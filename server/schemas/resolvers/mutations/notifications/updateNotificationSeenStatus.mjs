import { Notification } from "../../../../models/index.mjs";

const updateNotificationSeenStatus = async (notificationId, seen) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { $set: { read: seen } },
      { new: true }
    );

    if (!updatedNotification) {
      throw new Error("Notification not found");
    }

    return updatedNotification;
  } catch (error) {
    console.error(`Error updating notification seen status: ${error.message}`);
    throw new Error("An error occurred during notification update.");
  }
};

export default updateNotificationSeenStatus;
