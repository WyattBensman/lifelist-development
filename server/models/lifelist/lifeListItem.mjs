import { Schema, model } from "mongoose";

const lifeListItemSchema = new new Schema({})();

// Create Model
const LifeListItem = model("LifeListItem", lifeListItemSchema);

export default LifeListItem;
