import { Schema } from "mongoose";

const userSettingsSchema = new Schema({
  isProfilePrivate: {
    type: Boolean,
    default: false,
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
