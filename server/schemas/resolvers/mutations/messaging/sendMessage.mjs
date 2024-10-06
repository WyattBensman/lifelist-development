import { Conversation, User, Message } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const sendMessage = async (
  _,
  { conversationId, recipientId, content },
  { user }
) => {
  try {
    isUser(user);

    const newMessage = await Message.create({
      sender: user,
      content,
    });

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: newMessage },
        $set: { lastMessage: newMessage },
      },
      { new: true, runValidators: true }
    ).populate("messages");

    const recipient = await User.findById(recipientId);

    if (!recipient) {
      throw new Error("Recipient not found.");
    }

    const recipientRemoved = await User.exists({
      _id: recipient._id,
      "conversations.conversation": conversationId,
    });

    if (recipientRemoved) {
      await User.updateOne(
        { _id: recipient._id },
        {
          $addToSet: {
            conversations: {
              conversation: conversationId,
              isRead: false,
            },
          },
        }
      );
    }

    await User.updateOne(
      { _id: user._id, "conversations.conversation": conversationId },
      { $set: { "conversations.$.isRead": true } }
    );

    await User.updateOne(
      { _id: recipient._id, "conversations.conversation": conversationId },
      { $set: { "conversations.$.isRead": false } }
    );

    await createNotification({
      recipientId: recipient._id,
      senderId: user._id,
      type: "MESSAGE",
      message: `You received a new message from ${user.fullName}`,
    });

    return {
      success: true,
      message: "Message sent successfully",
      conversation: updatedConversation,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return {
      success: false,
      message: "An error occurred during message sending.",
    };
  }
};

export default sendMessage;
