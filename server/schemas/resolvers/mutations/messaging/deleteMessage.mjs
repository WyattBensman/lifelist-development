import { Conversation, Message } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteMessage = async (_, { conversationId, messageId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the message exists in the conversation
    const messageToDelete = await Message.findById(messageId);

    if (!messageToDelete) {
      throw new Error("Message not found");
    }

    // Check if the authenticated user is the sender of the message
    if (user._id.toString() !== messageToDelete.sender.toString()) {
      throw new Error("You are not the sender of this message");
    }

    // Delete the message from the conversation
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $pull: { messages: messageId } },
      { new: true, runValidators: true }
    ).populate("messages");

    // Delete the message from the Message collection
    await Message.findByIdAndDelete(messageId);

    // Check if the deleted message was the last message
    if (messageId.toString() === updatedConversation.lastMessage.toString()) {
      // Find the previous message in the conversation
      const previousMessage = updatedConversation.messages.slice(-1)[0];

      // Update the lastMessage field to the previous message
      updatedConversation.lastMessage = previousMessage;
      await updatedConversation.save();
    }

    return updatedConversation;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during message deletion.");
  }
};

export default deleteMessage;
