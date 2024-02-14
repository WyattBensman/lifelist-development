import { Schema, model } from "mongoose";

const cameraAlbumSchema = new new Schema({})();

// Create Model
const CameraAlbum = model("CameraAlbum", cameraAlbumSchema);

export default CameraAlbum;
