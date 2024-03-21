import { Notification, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteNotification = async (_, { notificationId }, { user }) => {
  try {
    isUser(user);

    // Remove the notification from the user's notifications array
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { notifications: notificationId } },
      { new: true }
    ).populate("notifications");

    if (!updatedUser) {
      throw new Error(`User with ID ${user._id} not found.`);
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
