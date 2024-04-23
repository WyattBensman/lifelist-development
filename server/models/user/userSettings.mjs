import { Schema } from "mongoose";

const userSettingsSchema = new Schema({
  privacy: {
    type: String,
    enum: ["PUBLIC", "PRIVATE"],
    default: "PUBLIC",
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    enum: ["EN", "ES", "FR", "DE"],
    default: "EN",
  },
  notifications: {
    type: Boolean,
    default: true,
  },
  postRepostToMainFeed: {
    type: Boolean,
    default: false,
  },
});

export default userSettingsSchema;
