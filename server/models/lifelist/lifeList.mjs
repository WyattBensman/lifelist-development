import { Schema, model } from "mongoose";

const lifeListSchema = new new Schema({})();

// Create Model
const LifeList = model("LifeList", lifeListSchema);

export default LifeList;
