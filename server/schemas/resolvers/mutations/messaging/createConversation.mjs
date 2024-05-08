import { Conversation, User, Message } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const createConversation = async (_, { recipientId, message }, { user }) => {
  try {
    isUser(user);

    // Find or create the conversation
    let conversation = await Conversation.findOneAndUpdate(
      { participants: { $all: [user._id, recipientId] } },
      {},
      { new: true, populate: "messages" }
    );

    if (!conversation) {
      // If the conversation does not exist, create it
      conversation = new Conversation({
        participants: [user._id, recipientId],
      });
      await conversation.save();

      // Ensure the conversation is in each participant's list
      await User.updateMany(
        { _id: { $in: [user._id, recipientId] } },
        { $addToSet: { conversations: conversation._id } }
      );
    }

    // Create and append the new message
    const newMessage = await Message.create({
      sender: user._id,
      content: message,
      conversation: conversation._id,
      sentAt: new Date(),
    });

    conversation.messages.push(newMessage);
    conversation.lastMessage = newMessage;
    await conversation.save();

    // Notify the recipient of the new message
    await createNotification({
      recipientId,
      senderId: user._id,
      type: "MESSAGE",
      message: `You received a new message from ${user.fullName}`,
    });

    return conversation;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("Failed to create or update the conversation.");
  }
};

export default createConversation;
