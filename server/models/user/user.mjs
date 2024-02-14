import { Schema, model } from "mongoose";

const userSchema = new new Schema({})();

// Create Model
const User = model("User", userSchema);

export default User;
