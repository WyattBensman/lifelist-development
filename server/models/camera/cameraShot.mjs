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
});

const CameraShot = model("CameraShot", cameraShotSchema);

export default CameraShot;
