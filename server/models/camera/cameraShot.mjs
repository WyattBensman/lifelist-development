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
  camera: {
    type: String,
    enum: ["35MM_CAMERA", "FUJI_400"],
  },
  filtered: {
    type: Boolean,
    default: false,
  },
  shotOrientation: {
    type: String,
    enum: ["VERTICAL", "HORIZONTAL"],
    default: "VERTICAL",
  },
});

const CameraShot = model("CameraShot", cameraShotSchema);

export default CameraShot;
