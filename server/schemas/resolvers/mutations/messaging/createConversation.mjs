import { Conversation, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const createConversation = async (_, { recipientId, message }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Create a new conversation
    const newConversation = await Conversation.create({
      participants: [user.id, recipientId],
      messages: [{ sender: user.id, content: message }],
    });

    // Update the users' conversations
    await Promise.all([
      User.update(
        { _id: user.id },
        { $push: { conversations: newConversation.id } }
      ),
      // Assuming the recipient also has a 'conversations' field
      User.update(
        { _id: recipientId },
        { $push: { conversations: newConversation.id } }
      ),
    ]);

    return newConversation;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during conversation creation.");
  }
};

export default createConversation;
