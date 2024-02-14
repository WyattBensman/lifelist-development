import { Schema, model } from "mongoose";

const cameraShotSchema = new new Schema({})();

// Create Model
const CameraShot = model("CameraShot", cameraShotSchema);

export default CameraShot;
