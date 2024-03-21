import { Schema, model } from "mongoose";
import reportSchema from "./reportSchema.mjs";

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
  coverImage: {
    type: String,
    default: function () {
      return this.images.length > 0 ? this.images[0] : null;
    },
  },
  caption: {
    type: String,
    maxlength: 75,
  },
  entries: [
    {
      title: {
        type: String,
      },
      content: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
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
  saves: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  /* audience: {
    type: String,
    enum: ["PUBLIC", "PRIVATE", "CUSTOM"],
    default: "PUBLIC",
  }, */
  posted: {
    type: Boolean,
    default: false,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  reports: {
    type: [reportSchema],
  },
});

const Collage = model("Collage", collageSchema);

export default Collage;
