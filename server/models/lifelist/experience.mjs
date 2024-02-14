import { Schema, model } from "mongoose";

const experienceSchema = new new Schema({})();

// Create Model
const Experience = model("Experience", experienceSchema);

export default Experience;
