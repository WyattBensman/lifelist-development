import { Schema } from "mongoose";

const privacyGroupSchema = new Schema({
  groupName: {
    type: String,
    required: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const userSettingsSchema = new Schema({
  privacy: {
    type: String,
    enum: ["public", "private", "friendsOnly"],
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
  blocked: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  privacyGroups: [privacyGroupSchema],
});

export default userSettingsSchema;
