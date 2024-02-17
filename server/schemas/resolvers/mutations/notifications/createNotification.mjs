import Notification from "../../../../models/Notification.mjs";

export const createNotification = async ({
  recipientId,
  senderId,
  type,
  collageId,
  message,
}) => {
  try {
    const newNotification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type: type,
      collage: collageId,
      message: message,
    });

    return newNotification;
  } catch (error) {
    console.error(`Error creating notification: ${error.message}`);
    throw new Error("An error occurred during notification creation.");
  }
};
