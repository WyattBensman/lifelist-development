import { Schema, model } from "mongoose";

const cameraShotSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  capturedAt: {
    type: Date,
    default: Date.now,
  },
  developingTime: {
    type: Number,
    required: true,
    default: () => Math.floor(Math.random() * (16 - 4 + 1)) + 4, // Random time between 4-16 minutes
  },
  isDeveloped: {
    type: Boolean,
    default: false, // Start as false; it will be true once developing time has passed
  },
  readyToReviewAt: {
    type: Date,
    required: true,
    default: function () {
      return new Date(Date.now() + this.developingTime * 60000); // Add developing time in milliseconds
    },
  },
  transferredToRoll: {
    type: Boolean,
    default: false, // Becomes true once the shot is moved to the camera roll
  },
});

const CameraShot = model("CameraShot", cameraShotSchema);

export default CameraShot;
