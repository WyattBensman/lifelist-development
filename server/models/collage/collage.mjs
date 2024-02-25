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
  },
  caption: {
    type: String,
    maxlength: 75,
  },
  summary: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  finishDate: {
    type: Date,
  },
  month: {
    name: {
      type: String,
    },
    year: {
      type: Number,
    },
  },
  experiences: [
    {
      type: Schema.Types.ObjectId,
      ref: "Experience",
    },
  ],
  locations: [
    {
      name: {
        type: String,
      },
      coordinates: {
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        },
      },
    },
  ],
  tagged: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  reposts: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  audience: [
    {
      type: Schema.Types.ObjectId,
      ref: "PrivacyGroup",
    },
  ],
  posted: {
    type: Boolean,
    default: false,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  reports: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      reason: {
        type: String,
        required: true,
      },
    },
  ],
});

const Collage = model("Collage", collageSchema);

export default Collage;
