import { Schema, model } from "mongoose";

const cameraShotAlbumSchema = new new Schema({})();

// Create Model
const CameraShotAlbum = model("CameraShotAlbum", cameraShotAlbumSchema);

export default CameraShotAlbum;
