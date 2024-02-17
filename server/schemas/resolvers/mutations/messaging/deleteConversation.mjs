import { Conversation, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const deleteConversation = async (_, { conversationId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Remove the conversation from the current user's list
    await User.findByIdAndUpdate(user.id, {
      $pull: { conversations: conversationId },
    });

    return {
      message: "Conversation removed successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during conversation removal.");
  }
};
