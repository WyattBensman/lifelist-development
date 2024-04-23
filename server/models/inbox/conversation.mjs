import { Schema, model } from "mongoose";

const conversationSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
});

const Conversation = model("Conversation", conversationSchema);

export default Conversation;
