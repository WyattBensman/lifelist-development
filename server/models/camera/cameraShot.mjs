import { Schema, model } from "mongoose";

// Dimension options based on aspect ratios
const DIMENSION_OPTIONS = {
  THREETWO: { width: 1200, height: 800 }, // 3:2 aspect ratio
  TWOTHREE: { width: 800, height: 1200 }, // 2:3 aspect ratio
  SIXNINE: { width: 800, height: 1400 }, // 16:9 aspect ratio
  NINESIX: { width: 1400, height: 800 }, // 9:16 aspect ratio
};

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
    enum: ["STANDARD", "FUJI", "DISPOSABLE", "POLAROID"],
    default: "STANDARD",
  },
  shotOrientation: {
    type: String,
    enum: ["VERTICAL", "HORIZONTAL"],
    default: "VERTICAL",
  },
  dimensions: {
    type: {
      width: Number,
      height: Number,
    },
    default: () => DIMENSION_OPTIONS.TWOTHREE,
  },
});

const CameraShot = model("CameraShot", cameraShotSchema);

export default CameraShot;
