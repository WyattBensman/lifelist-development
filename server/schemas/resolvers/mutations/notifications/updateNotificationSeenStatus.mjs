import Notification from "../../../../models/Notification.mjs";
import { UserInputError } from "apollo-server";

export const updateNotificationSeenStatus = async (notificationId, seen) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { $set: { read: seen } },
      { new: true }
    );

    if (!updatedNotification) {
      throw new UserInputError("Notification not found");
    }

    return updatedNotification;
  } catch (error) {
    console.error(`Error updating notification seen status: ${error.message}`);
    throw new Error("An error occurred during notification update.");
  }
};
