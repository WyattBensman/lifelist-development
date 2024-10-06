import { Schema, model } from "mongoose";

const invitedFriendSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ["INVITED", "JOINED", "EXPIRED"],
    default: "INVITED",
  },
  inviteCode: { type: String, unique: true }, // Unique invite code to track who joins
  invitedAt: { type: Date, default: Date.now }, // Track when the invite was sent
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 72 * 60 * 60 * 1000), // 72 Hours
  },
});

export default InvitedFriend;
