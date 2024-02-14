import { Schema, model } from "mongoose";

const notificationSchema = new new Schema({})();

// Create Model
const Notification = model("Notification", notificationSchema);

export default Notification;
