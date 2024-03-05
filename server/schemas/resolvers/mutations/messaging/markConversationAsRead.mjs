import { Conversation, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const markConversationAsRead = async (_, { conversationId }, { user }) => {
  try {
    // Check if the user is authenticated
    /* isUser(user); */

    // Update the current user's conversations array to set isRead to true
    await User.updateOne(
      {
        _id: "65e08edb5242a6c8ff3c8152",
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
