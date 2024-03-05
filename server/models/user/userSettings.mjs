import { Schema } from "mongoose";

const userSettingsSchema = new Schema({
  privacy: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    default: "en",
  },
  notifications: {
    type: Boolean,
    default: true,
  },
});

export default userSettingsSchema;
