import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "FOLLOW_REQUEST",
      "FOLLOW",
      "COLLAGE_REPOST",
      "COMMENT",
      "TAG",
      "MESSAGE",
    ],
    required: true,
  },
  collage: {
    type: Schema.Types.ObjectId,
    ref: "Collage",
  },
  message: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = model("Notification", notificationSchema);

export default Notification;
