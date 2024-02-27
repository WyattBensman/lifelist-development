import { Conversation } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const sendMessage = async (_, { conversationId, content }, { user }) => {
  try {
    // Check if the user is authenticated
    /* isUser(user); */

    // Add the message to the conversation
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          messages: {
            sender: "65d762da8d7b7d7105af76b3",
            content,
          },
        },
      },
      { new: true, runValidators: true }
    );

    return updatedConversation;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during message sending.");
  }
};

export default sendMessage;
