import { User, Conversation, Message } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const deleteConversation = async (_, { conversationId }, { user }) => {
  try {
    isUser(user);

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    await User.findByIdAndUpdate(user._id, {
      $pull: { conversations: { conversation: conversationId } },
    });

    const updatedUser = await User.findById(user._id)
      .populate({
        path: "conversations.conversation",
        model: "Conversation",
        populate: [
          { path: "lastMessage", model: "Message" },
          {
            path: "participants",
            model: "User",
            select: "fullName profilePicture",
          },
        ],
      })
      .exec();

    const participants = conversation.participants.map((participant) =>
      participant.toString()
    );
    const participantsWithConversation = await User.find({
      _id: { $in: participants },
      "conversations.conversation": conversationId,
    });

    if (participantsWithConversation.length > 0) {
      return {
        success: true,
        message: "Conversation deleted successfully",
        conversations: updatedUser.conversations,
      };
    }

    await Conversation.findByIdAndDelete(conversationId);
    await Message.deleteMany({ _id: { $in: conversation.messages } });

    return {
      success: true,
      message: "Conversation and its messages deleted successfully",
      conversations: updatedUser.conversations,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return {
      success: false,
      message: "An error occurred during conversation removal.",
    };
  }
};

export default deleteConversation;
