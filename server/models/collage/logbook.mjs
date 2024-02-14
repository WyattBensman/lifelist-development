import { Schema, model } from "mongoose";

const logbookSchema = new new Schema({})();

// Create Model
const Logbook = model("Logbook", logbookSchema);

export default Logbook;
