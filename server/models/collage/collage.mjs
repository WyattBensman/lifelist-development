import { Schema, model } from "mongoose";
import commentSchema from "./comment.mjs";

const validateImageCount = (value) => value.length > 0;
const validateMaxImageCount = (value) => value.length <= 14;

const collageSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  images: {
    type: [
      {
        type: String,
      },
    ],
    validate: [
      {
        validator: validateImageCount,
        message: "At least one image is required.",
      },
      {
        validator: validateMaxImageCount,
        message: "Maximum of 14 images allowed.",
      },
    ],
    required: true,
  },
  title: {
    type: String,
    maxlength: 40,
    required: true,
  },
  caption: {
    type: String,
    maxlength: 75,
  },
  summary: {
    type: String,
  },
  lifeListItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "LifeListItem",
    },
  ],
  tagged: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [commentSchema],
  reposts: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isInLogbook: {
    type: Boolean,
    default: false,
  },
  // Need to further understand usage
  audience: {
    type: Schema.Types.Mixed,
  },
});

const Collage = model("Collage", collageSchema);

export default Collage;
