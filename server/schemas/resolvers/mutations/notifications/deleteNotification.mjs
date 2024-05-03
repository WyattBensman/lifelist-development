import { Notification, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteNotification = async (_, { notificationId }, { user }) => {
  try {
    isUser(user);

    // Remove notification from the user's notifications list
    await User.findByIdAndUpdate(user._id, {
      $pull: { notifications: notificationId },
    });

    // Delete the notification from the database
    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );
    if (!deletedNotification) {
      throw new Error(`Notification with ID ${notificationId} not found.`);
    }

    return {
      success: true,
      message: "Notification deleted successfully.",
    };
  } catch (error) {
    console.error(`Error deleting notification: ${error.message}`);
    throw new Error("Failed to delete notification.");
  }
};

export default deleteNotification;
