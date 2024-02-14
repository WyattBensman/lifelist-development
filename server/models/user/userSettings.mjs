import { Schema, model } from "mongoose";

const userSettingsSchema = new new Schema({})();

// Create Model
const UserSettings = model("UserSettings", userSettingsSchema);

export default UserSettings;
