import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteConversation = async (_, { conversationId }, { user }) => {
  try {
    // Check if the user is authenticated
    /* isUser(user); */

    // Remove the conversation from the current user's list
    const updatedUser = await User.findByIdAndUpdate(
      "65d762da8d7b7d7105af76b3",
      {
        $pull: { conversations: conversationId },
      }
    );

    return {
      message: "Conversation deleted successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during conversation removal.");
  }
};

export default deleteConversation;
