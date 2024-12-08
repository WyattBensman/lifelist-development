import { Schema, model } from "mongoose";

const AccessCodeSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true, // Ensure codes are unique
  },
  endDate: {
    type: Date,
    required: true, // Expiration date for the code
  },
  count: {
    type: Number,
    default: 0, // Tracks total uses of the code
  },
  users: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
      usedAt: {
        type: Date,
        default: Date.now, // Timestamp when the code was used
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true, // Indicates if the code is currently active
  },
});

const AccessCode = model("AccessCode", AccessCodeSchema);

export default AccessCode;
