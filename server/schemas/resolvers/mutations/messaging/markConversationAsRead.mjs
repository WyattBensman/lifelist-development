import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const markConversationAsRead = async (_, { conversationId }, { user }) => {
  try {
    isUser(user);

    await User.updateOne(
      { _id: user._id, "conversations.conversation": conversationId },
      { $set: { "conversations.$.isRead": true } }
    );

    return {
      success: true,
      message: "Conversation marked as read successfully",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return {
      success: false,
      message: "An error occurred during marking conversation as read.",
    };
  }
};

export default markConversationAsRead;
