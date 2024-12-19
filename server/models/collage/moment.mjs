import { Schema, model } from "mongoose";
import reportSchema from "./reportSchema.mjs";

const MomentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  cameraShot: {
    type: Schema.Types.ObjectId,
    ref: "CameraShot", // Reference to the CameraShot model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current time
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  views: [
    {
      type: Schema.Types.ObjectId,
      ref: "User", // Users who have viewed the story
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User", // Track users who liked the story
    },
  ],
  reports: [reportSchema],
});

// Pre-save middleware to automatically calculate `expiresAt`
MomentSchema.pre("save", function (next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(this.createdAt.getTime() + 24 * 60 * 60 * 1000); // Default to 24 hours later
  }
  next();
});

const Moment = model("Moment", MomentSchema);

export default Moment;
