import { Notification, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteNotification = async (_, { notificationId }, { user }) => {
  try {
    // Check if the user is authenticated
    /* isUser(user); */

    // Remove the notification from the user's notifications array
    const updatedUser = await User.findByIdAndUpdate(
      "65e08edb5242a6c8ff3c8152",
      { $pull: { notifications: notificationId } },
      { new: true }
    ).populate("notifications");

    if (!updatedUser) {
      throw new Error(`User with ID ${"65e08edb5242a6c8ff3c8152"} not found.`);
    }

    // Delete the notification itself
    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );

    if (!deletedNotification) {
      throw new Error(`Notification with ID ${notificationId} not found.`);
    }

    return updatedUser.notifications;
  } catch (error) {
    console.error(`Error deleting notification: ${error.message}`);
    throw new Error("An error occurred during notification deletion.");
  }
};

export default deleteNotification;
