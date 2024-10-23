import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { LifeList, Message } from "../index.mjs";
import invitedFriendSchema from "./invitedFriend.mjs";
import userSettingsSchema from "./userSettings.mjs";

// Regular expression constants for validation
const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;
const phoneNumberRegex = /^\d{10}$/;
const fullNameRegex = /^[a-zA-Z\s]+$/;
const usernameRegex = /^[a-zA-Z]{2}[a-zA-Z0-9._-]*$/;

const userSchema = new Schema({
  // Identity
  fullName: {
    type: String,
    trim: true,
    match: [
      fullNameRegex,
      "Full name must only contain alphabetic characters and spaces.",
    ],
  },
  username: {
    type: String,
    minlength: [5, "Username must be at least 5 characters long."],
    maxlength: [24, "Username must not exceed 24 characters."],
    lowercase: true,
    trim: true,
    match: [
      usernameRegex,
      "Username must start with two alphabetic characters and may include numbers, dots, underscores, or dashes.",
    ],
  },
  bio: { type: String, maxlength: 150 },
  gender: { type: String, enum: ["MALE", "FEMALE", "PREFER NOT TO SAY"] },
  birthday: { type: Date },
  profilePicture: { type: String, default: "default-avatar.jpg" },

  // Contact Information
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [emailRegex, "Please enter a valid email address."],
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [
      phoneNumberRegex,
      "Phone number must be exactly 10 digits without any symbols or spaces.",
    ],
  },

  // Authentication
  password: {
    type: String,
    minlength: [8, "Password must be at least 8 characters long."],
    match: [
      passwordRegex,
      "Password must include at least one digit, one uppercase letter, and one special character.",
    ],
  },

  // User Relations
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  pendingFriendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],

  // Content
  lifeList: { type: Schema.Types.ObjectId, ref: "LifeList" },
  collages: [{ type: Schema.Types.ObjectId, ref: "Collage" }],
  likedCollages: [{ type: Schema.Types.ObjectId, ref: "Collage" }],
  repostedCollages: [{ type: Schema.Types.ObjectId, ref: "Collage" }],
  savedCollages: [{ type: Schema.Types.ObjectId, ref: "Collage" }],
  archivedCollages: [{ type: Schema.Types.ObjectId, ref: "Collage" }],
  taggedCollages: [{ type: Schema.Types.ObjectId, ref: "Collage" }],

  // Camera
  developingCameraShots: [{ type: Schema.Types.ObjectId, ref: "CameraShot" }],
  cameraShots: [{ type: Schema.Types.ObjectId, ref: "CameraShot" }],
  cameraAlbums: [{ type: Schema.Types.ObjectId, ref: "CameraAlbum" }],
  shotsLeft: {
    type: Number,
    default: 10,
  },

  // Notifications & Settings
  unreadMessagesCount: { type: Number, default: 0 },
  notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
  conversations: [
    {
      conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
      isRead: { type: Boolean, default: false },
    },
  ],
  settings: {
    type: userSettingsSchema,
    default: {
      isProfilePrivate: false,
      darkMode: false,
      language: "EN",
      notifications: true,
      postRepostToMainFeed: true,
    },
  },
  privacyGroups: [{ type: Schema.Types.ObjectId, ref: "PrivacyGroup" }],
  blocked: [{ type: Schema.Types.ObjectId, ref: "User" }],

  // Onboarding & Permissions
  isOnboardingComplete: { type: Boolean, default: false },
  hasAcceptedPermissions: { type: Boolean, default: false },
  invitedFriends: [{ type: Schema.Types.ObjectId, ref: "InvitedFriend" }],
  hasAcceptedTerms: { type: Boolean, default: false },

  // Verification
  verified: {
    type: Boolean,
    default: false,
  },
  emailVerification: {
    code: String,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  phoneVerification: {
    code: String,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  status: {
    type: String,
    enum: ["pending", "active", "expired"],
    default: "pending",
  },
  expiryDate: {
    type: Date,
    default: () => new Date(+new Date() + 48 * 60 * 60 * 1000), // 48 hours from now
  },
});

// Middleware for creating a LifeList when a new user is created
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const newLifeList = await LifeList.create({
      author: this._id,
      experiences: [],
    });
    this.lifeList = newLifeList._id;
  }
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Pre-save middleware to update the isProfileComplete field
userSchema.pre("save", function (next) {
  // Check all required fields to determine if the profile is complete
  this.isProfileComplete =
    (this.email || this.phoneNumber) && // At least one contact method must be filled
    this.username &&
    this.password &&
    this.fullName &&
    this.gender;

  // Proceed to the next middleware or save operation
  next();
});

// Middleware to update unreadMessagesCount after saving a user
userSchema.post("save", async function () {
  try {
    const count = await Message.countDocuments({
      recipient: this._id,
      isRead: false,
    });
    if (this.unreadMessagesCount !== count) {
      this.unreadMessagesCount = count;
      await this.save({ session: false });
    }
  } catch (error) {
    console.error("Error updating unreadMessagesCount:", error);
  }
});

// Instance method to mark a message as read
userSchema.methods.readMessage = async function (messageId) {
  const message = await Message.findByIdAndUpdate(
    messageId,
    { $set: { isRead: true } },
    { new: true }
  );
  if (message) {
    this.unreadMessagesCount = await Message.countDocuments({
      conversation: message.conversation,
      sender: { $ne: this._id },
      isRead: false,
    });
    await this.save();
  }
};

// Instance method to check password validity
userSchema.methods.isCorrectPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

export default User;
