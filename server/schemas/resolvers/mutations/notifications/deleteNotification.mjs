import { Notification } from "../../../../models/index.mjs";

const deleteNotification = async (notificationId) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );

    if (!deletedNotification) {
      throw new Error("Notification not found");
    }

    return {
      message: "Notification deleted successfully.",
    };
  } catch (error) {
    console.error(`Error deleting notification: ${error.message}`);
    throw new Error("An error occurred during notification deletion.");
  }
};

export default deleteNotification;
