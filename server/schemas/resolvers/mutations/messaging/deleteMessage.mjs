import { Conversation } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const deleteMessage = async (
  _,
  { conversationId, messageId },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

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
