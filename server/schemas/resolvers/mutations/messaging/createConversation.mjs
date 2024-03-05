import { Conversation, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const createConversation = async (_, { recipientId, message }, { user }) => {
  try {
    // Check if the user is authenticated
    /* isUser(user); */

    // Check if conversation exists between sender and recipient
    const existingConversation = await Conversation.findOne({
      participants: { $all: ["65e08edb5242a6c8ff3c8152", recipientId] },
    });

    if (existingConversation) {
      // Conversation exists, push the message
      existingConversation.messages.push({
        sender: "65e08edb5242a6c8ff3c8152",
        content: message,
        sentAt: new Date(),
      });

      existingConversation.lastMessage = {
        sender: "65e08edb5242a6c8ff3c8152",
        content: message,
        sentAt: new Date(),
      };

      await existingConversation.save();

      // Set isRead to true for the sender and false for the recipient in User model
      await User.updateOne(
        {
          _id: "65e08edb5242a6c8ff3c8152",
          "conversations.conversation": existingConversation._id,
        },
        { $set: { "conversations.$.isRead": true } }
      );

      await User.updateOne(
        {
          _id: recipientId,
          "conversations.conversation": existingConversation._id,
        },
        { $set: { "conversations.$.isRead": false } }
      );

      // Create a notification for the recipient
      await createNotification({
        recipientId,
        senderId: "65e08edb5242a6c8ff3c8152",
        type: "MESSAGE",
        message: `You received a new message from`,
      });

      return existingConversation;
    } else {
      // Conversation does not exist, create a new one
      const newConversation = new Conversation({
        participants: ["65e08edb5242a6c8ff3c8152", recipientId],
        messages: [
          {
            sender: "65e08edb5242a6c8ff3c8152",
            content: message,
            sentAt: new Date(),
          },
        ],
        lastMessage: {
          sender: "65e08edb5242a6c8ff3c8152",
          content: message,
          sentAt: new Date(),
        },
        isRead: false,
      });

      await newConversation.save();

      // Set isRead to true for the sender and false for the recipient in User model
      await User.updateOne(
        { _id: "65e08edb5242a6c8ff3c8152" },
        {
          $addToSet: {
            conversations: { conversation: newConversation._id, isRead: true },
          },
        }
      );

      await User.updateOne(
        { _id: recipientId },
        {
          $addToSet: {
            conversations: { conversation: newConversation._id, isRead: false },
          },
        }
      );

      // Create a notification for the recipient
      await createNotification({
        recipientId,
        senderId: "65e08edb5242a6c8ff3c8152",
        type: "MESSAGE",
        message: `You received a new message from`,
      });

      return newConversation;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during conversation creation.");
  }
};

export default createConversation;
