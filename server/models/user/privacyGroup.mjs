import { Schema, model } from "mongoose";

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

const PrivacyGroup = model("PrivacyGroup", privacyGroupSchema);

export default PrivacyGroup;
