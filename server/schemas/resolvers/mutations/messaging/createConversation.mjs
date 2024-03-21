import { Conversation, User, Message } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const createConversation = async (_, { recipientId, message }, { user }) => {
  try {
    isUser(user);

    // Find the existing conversation between sender and recipient
    let existingConversation = await Conversation.findOne({
      participants: { $all: [user._id, recipientId] },
    }).populate("messages");

    if (!existingConversation) {
      // Conversation does not exist, create a new one
      const newConversation = new Conversation({
        participants: [user._id, recipientId],
      });

      existingConversation = await newConversation.save();
    }

    // Check if the recipient removed the conversation
    const recipientRemoved = await User.exists({
      _id: recipientId,
      "conversations.conversation": existingConversation._id,
    });

    if (!recipientRemoved) {
      // If the recipient removed the conversation, add it back to their conversations array
      await User.updateOne(
        { _id: recipientId },
        {
          $addToSet: {
            conversations: {
              conversation: existingConversation._id,
              isRead: false,
            },
          },
        }
      );
    }

    // Create and save the new message
    const newMessage = await Message.create({
      sender: user._id,
      content: message,
      sentAt: new Date(),
    });

    existingConversation.messages.push(newMessage);
    existingConversation.lastMessage = newMessage;
    await existingConversation.save();

    // Update isRead for the sender in User model
    await User.updateOne(
      {
        _id: "65e08edb5242a6c8ff3c8152",
        "conversations.conversation": existingConversation._id,
      },
      { $set: { "conversations.$.isRead": true } }
    );

    // Create a notification for the recipient
    await createNotification({
      recipientId,
      senderId: user._id,
      type: "MESSAGE",
      message: `You received a new message from ${user.fullName}`,
    });

    return existingConversation;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during conversation creation.");
  }
};

export default createConversation;
