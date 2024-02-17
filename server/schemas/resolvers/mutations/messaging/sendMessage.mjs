import { Conversation } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const sendMessage = async (
  _,
  { conversationId, senderId, content },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Add the message to the conversation
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          messages: {
            sender: senderId,
            content,
          },
        },
      },
      { new: true, runValidators: true }
    );

    return updatedConversation.messages[
      updatedConversation.messages.length - 1
    ];
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during message sending.");
  }
};
