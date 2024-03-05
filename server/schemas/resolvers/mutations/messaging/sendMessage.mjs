import { Conversation, User, Message } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const sendMessage = async (
  _,
  { conversationId, recipientId, content },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Create the new message
    const newMessage = await Message.create({
      sender: user._id,
      content,
    });

    // Add the new message to the conversation
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: newMessage },
        $set: { lastMessage: newMessage },
      },
      { new: true, runValidators: true }
    ).populate("messages");

    // Find the recipient directly using recipientId
    const recipient = await User.findById(recipientId);

    if (!recipient) {
      throw new Error("Recipient not found.");
    }

    // Check if the recipient removed the conversation
    const recipientRemoved = await User.exists({
      _id: recipient._id,
      "conversations.conversation": conversationId,
    });

    if (recipientRemoved) {
      // If the recipient removed the conversation, add it back to their conversations array
      await User.updateOne(
        { _id: recipient._id },
        {
          $addToSet: {
            conversations: {
              conversation: conversationId,
              isRead: false,
            },
          },
        }
      );
    }

    await User.updateOne(
      {
        _id: user._id,
        "conversations.conversation": conversationId,
      },
      { $set: { "conversations.$.isRead": true } }
    );

    await User.updateOne(
      { _id: recipient._id, "conversations.conversation": conversationId },
      { $set: { "conversations.$.isRead": false } }
    );

    await createNotification({
      recipientId: recipient._id,
      senderId: user._id,
      type: "MESSAGE",
      message: `You received a new message from ${user.fullName}`,
    });

    return updatedConversation;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during message sending.");
  }
};

export default sendMessage;
