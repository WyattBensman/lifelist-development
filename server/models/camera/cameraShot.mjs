import { Schema, model } from "mongoose";

const cameraShotSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  camera: {
    type: Schema.Types.ObjectId,
    ref: "Camera",
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
  filtered: {
    type: Boolean,
    default: false,
  },
});

const CameraShot = model("CameraShot", cameraShotSchema);

export default CameraShot;
