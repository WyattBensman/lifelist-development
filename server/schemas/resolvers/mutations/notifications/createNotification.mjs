import { Notification, User } from "../../../../models/index.mjs";

const createNotification = async ({
  recipientId,
  senderId,
  type,
  collageId,
  message,
}) => {
  try {
    // Create a new notification and save to database
    const newNotification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type: type,
      collage: collageId,
      message: message,
    });

    // Add this notification to the recipient's notification list
    await User.findByIdAndUpdate(recipientId, {
      $addToSet: { notifications: newNotification._id },
    });

    return {
      success: true,
      message: "Notification created successfully.",
    };
  } catch (error) {
    console.error(`Error creating notification: ${error.message}`);
    throw new Error("Failed to create notification.");
  }
};

export default createNotification;
