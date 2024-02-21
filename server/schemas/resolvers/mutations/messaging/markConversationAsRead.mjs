import { Conversation } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const markConversationAsRead = async (_, { conversationId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Mark the conversation as read
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $set: { isRead: true } },
      { new: true, runValidators: true }
    );

    return updatedConversation;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during marking conversation as read.");
  }
};

export default markConversationAsRead;
