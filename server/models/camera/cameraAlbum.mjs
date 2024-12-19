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

const CameraAlbum = model("CameraAlbum", cameraAlbumSchema);

export default CameraAlbum;
