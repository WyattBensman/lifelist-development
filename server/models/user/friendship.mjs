import { Schema, model } from "mongoose";

const friendshipSchema = new new Schema({})();

// Create Model
const Friendship = model("Friendship", friendshipSchema);

export default Friendship;
