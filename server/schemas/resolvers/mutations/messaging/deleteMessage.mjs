import { Conversation } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteMessage = async (_, { conversationId, messageId }, { user }) => {
  try {
    // Check if the user is authenticated
    /* isUser(user); */

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Find the message to be deleted
    const messageToDelete = conversation.messages.find(
      (message) => message._id.toString() === messageId
    );

    if (!messageToDelete) {
      throw new Error("Message not found");
    }

    // Check if the authenticated user is the sender of the message
    if (user._id !== messageToDelete.sender.toString()) {
      throw new Error("You are not the sender of this message");
    }

    // Delete the message from the conversation
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $pull: { messages: { _id: messageId } } },
      { new: true, runValidators: true }
    );

    return updatedConversation;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during message deletion.");
  }
};

export default deleteMessage;
