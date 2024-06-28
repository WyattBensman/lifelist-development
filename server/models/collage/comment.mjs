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
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Method to like a comment
commentSchema.methods.like = function (userId) {
  if (!this.likedBy.includes(userId)) {
    this.likes += 1;
    this.likedBy.push(userId);
  }
  return this.save();
};

// Method to unlike a comment
commentSchema.methods.unlike = function (userId) {
  const index = this.likedBy.indexOf(userId);
  if (index !== -1) {
    this.likes -= 1;
    this.likedBy.splice(index, 1);
  }
  return this.save();
};

const Comment = model("Comment", commentSchema);

export default Comment;
