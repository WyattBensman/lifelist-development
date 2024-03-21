import { Conversation, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const markConversationAsRead = async (_, { conversationId }, { user }) => {
  try {
    isUser(user);

    // Update the current user's conversations array to set isRead to true
    await User.updateOne(
      {
        _id: user._id,
        "conversations.conversation": conversationId,
      },
      { $set: { "conversations.$.isRead": true } }
    );

    const conversation = await Conversation.findById(conversationId);

    return conversation;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during marking conversation as read.");
  }
};

export default markConversationAsRead;
