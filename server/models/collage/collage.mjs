import { Schema, model } from "mongoose";
import reportSchema from "./reportSchema.mjs";

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
  caption: {
    type: String,
    maxlength: 75,
  },
  images: {
    type: [
      {
        type: String,
        required: true,
      },
    ],
    validate: [
      {
        validator: function (images) {
          return images.length >= 1 && images.length <= 12;
        },
        message: "A collage must have between 1 and 12 images.",
      },
    ],
  },
  coverImage: {
    type: String,
    default: function () {
      return this.images.length > 0 ? this.images[0] : null;
    },
  },
  privacy: {
    type: String,
    enum: ["PUBLIC", "PRIVATE", "PRIVACY_GROUP", "TAGGED"],
    default: "PUBLIC",
  },
  privacyGroup: {
    type: Schema.Types.ObjectId,
    ref: "PrivacyGroup",
  },
  locations: [
    {
      name: { type: String },
      coordinates: {
        type: { type: String, default: "Point" },
        coordinates: [Number],
      },
    },
  ],
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  reposts: [{ type: Schema.Types.ObjectId, ref: "User" }],
  saves: [{ type: Schema.Types.ObjectId, ref: "User" }],
  tagged: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  posted: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  reports: [reportSchema],
});

collageSchema.index({ locations: "2dsphere" });

const Collage = model("Collage", collageSchema);

export default Collage;
