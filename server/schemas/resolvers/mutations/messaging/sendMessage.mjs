import { Conversation } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const sendMessage = async (_, { conversationId, content }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Add the message to the conversation
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          messages: {
            sender: user._id,
            content,
          },
        },
      },
      { new: true, runValidators: true }
    );

    // Create a notification for the recipient
    const conversation = await Conversation.findById(conversationId).populate(
      "participants"
    );

    const recipient = conversation.participants.find(
      (participant) => participant._id.toString() !== user._id.toString()
    );

    await createNotification({
      recipientId: recipient._id,
      senderId: user._id,
      type: "MESSAGE",
      message: `You received a new message from ${user.fullName}`,
    });

    return updatedConversation;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during message sending.");
  }
};

export default sendMessage;
