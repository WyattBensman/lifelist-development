import { Schema, model } from "mongoose";

const cameraSchema = new new Schema({})();

// Create Model
const Camera = model("Camera", cameraSchema);

export default Camera;
