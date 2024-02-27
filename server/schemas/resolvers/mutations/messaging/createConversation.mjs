import { Conversation, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const createConversation = async (_, { recipientId, message }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if conversation exists between sender and recipient
    const existingConversation = await Conversation.findOne({
      participants: { $all: [user._id, recipientId] },
    });

    if (existingConversation) {
      // Conversation exists, push the message
      existingConversation.messages.push({
        sender: user._id,
        content: message,
        sentAt: new Date(),
      });

      existingConversation.lastMessage = {
        sender: user._id,
        content: message,
        sentAt: new Date(),
      };

      existingConversation.isRead = false;

      await existingConversation.save();

      // Update conversations field for both sender and recipient
      await User.updateMany(
        { _id: { $in: [user._id, recipientId] } },
        { $addToSet: { conversations: existingConversation._id } }
      );

      return existingConversation;
    } else {
      // Conversation does not exist, create a new one
      const newConversation = new Conversation({
        participants: [user._id, recipientId],
        messages: [
          {
            sender: user._id,
            content: message,
            sentAt: new Date(),
          },
        ],
        lastMessage: {
          sender: user._id,
          content: message,
          sentAt: new Date(),
        },
        isRead: false,
      });

      await newConversation.save();

      // Update conversations field for both sender and recipient
      await User.updateMany(
        { _id: { $in: [user._id, recipientId] } },
        { $addToSet: { conversations: newConversation._id } }
      );

      return newConversation;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during conversation creation.");
  }
};

export default createConversation;
