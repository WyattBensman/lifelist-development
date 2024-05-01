import { Schema, model } from "mongoose";

const cameraAlbumSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 40,
  },
  description: {
    type: String,
    maxlength: 75,
  },
  shots: [
    {
      type: Schema.Types.ObjectId,
      ref: "CameraShot",
    },
  ],
  shotsCount: {
    type: Number,
    default: 0,
  },
});

// Pre-save hook to update shotsCount
cameraAlbumSchema.pre("save", async function (next) {
  this.shotsCount = this.shots.length;
  next();
});

const CameraAlbum = model("CameraAlbum", cameraAlbumSchema);

export default CameraAlbum;
