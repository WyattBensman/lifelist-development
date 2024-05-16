import { Schema, model } from "mongoose";

// Dimension options based on aspect ratios
const DIMENSION_OPTIONS = {
  THREETWO: { width: 2400, height: 1600 }, // 3:2 aspect ratio
  TWOTHREE: { width: 1600, height: 2400 }, // 2:3 aspect ratio
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
    default: function () {
      return this.shotOrientation === "VERTICAL"
        ? DIMENSION_OPTIONS.TWOTHREE
        : DIMENSION_OPTIONS.THREETWO;
    },
  },
});

// Pre-save middleware to set the dimensions based on shotOrientation
cameraShotSchema.pre("save", function (next) {
  if (this.shotOrientation === "VERTICAL") {
    this.dimensions = DIMENSION_OPTIONS.TWOTHREE;
  } else if (this.shotOrientation === "HORIZONTAL") {
    this.dimensions = DIMENSION_OPTIONS.THREETWO;
  }
  next();
});

const CameraShot = model("CameraShot", cameraShotSchema);

export default CameraShot;
