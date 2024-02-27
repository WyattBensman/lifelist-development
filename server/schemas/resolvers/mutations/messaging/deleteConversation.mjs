import { User, Conversation } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteConversation = async (_, { conversationId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the conversation exists in both users' conversations
    const conversationExists = await Conversation.exists({
      _id: conversationId,
    });

    if (!conversationExists) {
      throw new Error("Conversation not found");
    }

    // Remove the conversation from the current user's list
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $pull: { conversations: conversationId },
      },
      { new: true }
    );

    // Check if the conversation is present in any other user's conversations
    const otherUserWithConversation = await User.exists({
      _id: { $ne: user._id },
      conversations: conversationId,
    });

    if (!otherUserWithConversation) {
      await Conversation.findByIdAndDelete(conversationId);
    }

    return {
      message: "Conversation deleted successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during conversation removal.");
  }
};

export default deleteConversation;
