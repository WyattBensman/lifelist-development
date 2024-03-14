import { Schema, model } from "mongoose";
import reportSchema from "./reportSchema.mjs";

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  reports: {
    type: [reportSchema],
  },
});

const Comment = model("Comment", commentSchema);

export default Comment;
