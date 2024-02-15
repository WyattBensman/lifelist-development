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
});

const CameraAlbum = model("CameraAlbum", cameraAlbumSchema);

export default CameraAlbum;
