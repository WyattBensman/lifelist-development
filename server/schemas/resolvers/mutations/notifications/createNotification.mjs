import { Notification, User } from "../../../../models/index.mjs";

const createNotification = async ({
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

    // Update the recipient's notifications array
    await User.findByIdAndUpdate(
      recipientId,
      { $addToSet: { notifications: newNotification._id } },
      { new: true }
    );

    return newNotification;
  } catch (error) {
    console.error(`Error creating notification: ${error.message}`);
    throw new Error("Failed to create notification.");
  }
};

export default createNotification;
