import { Schema, model } from "mongoose";

const collageSchema = new new Schema({})();

// Create Model
const Collage = model("Collage", collageSchema);

export default Collage;
