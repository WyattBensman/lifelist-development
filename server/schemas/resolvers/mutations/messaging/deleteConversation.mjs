import { User, Conversation, Message } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteConversation = async (_, { conversationId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the conversation exists
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Remove the conversation from the current user's conversations field
    await User.findByIdAndUpdate(user._id, {
      $pull: { conversations: { conversation: conversationId } },
    });

    // Return the updated conversations field directly
    const updatedUser = await User.findById(user._id)
      .populate({
        path: "conversations.conversation",
        model: "Conversation",
        populate: [
          {
            path: "lastMessage",
            model: "Message",
          },
          {
            path: "participants",
            model: "User",
            select: "fullName profilePicture",
          },
        ],
      })
      .exec();

    // If the conversation exists in any participant's conversations field
    const participants = conversation.participants.map((participant) =>
      participant.toString()
    );
    const participantsWithConversation = await User.find({
      _id: { $in: participants },
      "conversations.conversation": conversationId,
    });

    if (participantsWithConversation.length > 0) {
      return updatedUser.conversations;
    }

    // Delete Conversation & Messages if conversation doesn't exist
    await Conversation.findByIdAndDelete(conversationId);
    await Message.deleteMany({ _id: { $in: conversation.messages } });

    return updatedUser.conversations;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during conversation removal.");
  }
};

export default deleteConversation;
