import { Schema, model } from "mongoose";

const cameraAlbumSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coverImage: {
    type: String,
    default: "",
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

// Pre-save hook to update shotsCount and coverImage
cameraAlbumSchema.pre("save", async function (next) {
  this.shotsCount = this.shots.length;

  if (this.shots.length > 0) {
    const firstShot = await this.model("CameraShot").findById(this.shots[0]);
    if (firstShot) {
      this.coverImage = firstShot.image;
    }
  } else {
    this.coverImage = "";
  }

  next();
});

const CameraAlbum = model("CameraAlbum", cameraAlbumSchema);

export default CameraAlbum;
