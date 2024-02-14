import { Schema, model } from "mongoose";

const messageSchema = new new Schema({})();

// Create Model
const Message = model("Message", messageSchema);

export default Message;
