import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteConversation = async (_, { conversationId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Remove the conversation from the current user's list
    const updatedUser = await User.findByIdAndUpdate(user.id, {
      $pull: { conversations: conversationId },
    });

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during conversation removal.");
  }
};

export default deleteConversation;
