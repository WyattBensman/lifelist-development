import { Schema, model } from "mongoose";

const collageSettingsSchema = new new Schema({})();

// Create Model
const CollageSettings = model("CollageSettings", collageSettingsSchema);

export default CollageSettings;
