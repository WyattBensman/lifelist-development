import { Conversation, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

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
            sender: "65e1109f53d40acba3a8e994",
            content,
          },
        },
        $set: {
          lastMessage: {
            sender: "65e1109f53d40acba3a8e994",
            content,
          },
        },
      },
      { new: true, runValidators: true }
    );

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found.");
    }

    const recipient = await User.findOne({
      _id: { $ne: "65e1109f53d40acba3a8e994" },
      _id: {
        $in: conversation.participants.map((participant) => participant._id),
      },
    });

    if (!recipient) {
      throw new Error("Recipient not found.");
    }

    await User.updateOne(
      {
        _id: "65e1109f53d40acba3a8e994",
        "conversations.conversation": conversationId,
      },
      { $set: { "conversations.$.isRead": true } }
    );

    await User.updateOne(
      { _id: recipient._id, "conversations.conversation": conversationId },
      { $set: { "conversations.$.isRead": false } }
    );

    await createNotification({
      recipientId: recipient._id,
      senderId: "65e1109f53d40acba3a8e994",
      type: "MESSAGE",
      message: `You received a new message from `,
    });

    return updatedConversation;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during message sending.");
  }
};

export default sendMessage;
