import { Conversation, Message } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteMessage = async (_, { conversationId, messageId }, { user }) => {
  try {
    isUser(user);

    const messageToDelete = await Message.findById(messageId);

    if (!messageToDelete) {
      throw new Error("Message not found");
    }

    if (user._id.toString() !== messageToDelete.sender.toString()) {
      throw new Error("You are not the sender of this message");
    }

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $pull: { messages: messageId } },
      { new: true, runValidators: true }
    ).populate("messages");

    await Message.findByIdAndDelete(messageId);

    if (messageId.toString() === updatedConversation.lastMessage.toString()) {
      const previousMessage = updatedConversation.messages.slice(-1)[0];
      updatedConversation.lastMessage = previousMessage;
      await updatedConversation.save();
    }

    return {
      success: true,
      message: "Message deleted successfully",
      conversation: updatedConversation,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return {
      success: false,
      message: "An error occurred during message deletion.",
    };
  }
};

export default deleteMessage;
