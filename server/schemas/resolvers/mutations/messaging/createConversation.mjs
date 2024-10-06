import { Conversation, User, Message } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const createConversation = async (_, { recipientId, message }, { user }) => {
  try {
    isUser(user);

    let conversation = await Conversation.findOneAndUpdate(
      { participants: { $all: [user, recipientId] } },
      {},
      { new: true, populate: "messages" }
    );

    if (!conversation) {
      conversation = new Conversation({
        participants: [user, recipientId],
      });
      await conversation.save();

      await User.updateMany(
        { _id: { $in: [user, recipientId] } },
        {
          $addToSet: {
            conversations: { conversation: conversation._id, isRead: false },
          },
        }
      );
    } else {
      await User.updateMany(
        {
          _id: { $in: [user, recipientId] },
          "conversations.conversation": { $ne: conversation._id },
        },
        {
          $addToSet: {
            conversations: { conversation: conversation._id, isRead: false },
          },
        }
      );
    }

    const newMessage = await Message.create({
      sender: user,
      content: message,
      conversation: conversation._id,
      sentAt: new Date(),
    });

    conversation.messages.push(newMessage);
    conversation.lastMessage = newMessage;
    await conversation.save();

    await createNotification({
      recipientId,
      senderId: user,
      type: "MESSAGE",
      message: `You received a new message from ${user.fullName}`,
    });

    return {
      success: true,
      message: "Conversation created successfully",
      conversation,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return {
      success: false,
      message: "Failed to create or update the conversation.",
    };
  }
};

export default createConversation;
