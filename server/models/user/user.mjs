import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import userSettingsSchema from "./userSettings.mjs";

const validatePassword = (value) => {
  return /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/.test(value);
};

const validateEmail = (value) => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
};

const validatePhoneNumber = (value) => {
  return /^\d{10}$/.test(value);
};

const userSchema = new Schema({
  fullName: {
    type: String,
    trim: true,
    match: /^[a-zA-Z\s]+$/,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
    validate: {
      validator: validateEmail,
      message: "Invalid email format.",
    },
  },
  phoneNumber: {
    type: String,
    trim: true,
    unique: true,
    validate: {
      validator: validatePhoneNumber,
      message: "Invalid phone number format.",
    },
  },
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
  password: {
    type: String,
    minlength: 8,
    validate: {
      validator: validatePassword,
      message:
        "Password must contain at least one number, one uppercase letter, and one special character.",
    },
  },
  profilePicture: { type: String, default: "default-avatar.jpg" },
  username: {
    type: String,
    minlength: 5,
    maxlength: 24,
    lowercase: true,
    match: /^[a-zA-Z]{2}[a-zA-Z0-9._-]*$/,
  },
  bio: {
    type: String,
    maxlength: 150,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Prefer not to say"],
  },
  birthday: {
    type: Date,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followRequests: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
        default: "PENDING",
      },
    },
  ],
  lifeList: {
    type: Schema.Types.ObjectId,
    ref: "LifeList",
  },
  collages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Collage",
    },
  ],
  dailyCameraShots: {
    count: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return value <= 10; // Maximum of 10 snapshots
        },
        message: "Maximum of 10 snapshots allowed per day.",
      },
    },
    lastReset: {
      type: Date,
      default: Date.now,
    },
  },
  cameraShots: [
    {
      type: Schema.Types.ObjectId,
      ref: "CameraShot",
    },
  ],
  cameraAlbums: [
    {
      type: Schema.Types.ObjectId,
      ref: "CameraAlbum",
    },
  ],
  repostedCollages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Collage",
    },
  ],
  taggedCollages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Collage",
    },
  ],
  savedCollages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Collage",
    },
  ],
  archivedCollages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Collage",
    },
  ],
  logbook: [
    {
      type: Schema.Types.ObjectId,
      ref: "Collage",
    },
  ],
  conversations: [
    {
      conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
      },
      isRead: {
        type: Boolean,
        default: false,
      },
    },
  ],
  unreadMessagesCount: {
    type: Number,
    default: 0,
  },
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  privacyGroups: [
    {
      type: Schema.Types.ObjectId,
      ref: "PrivacyGroup",
    },
  ],
  blocked: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  settings: {
    type: userSettingsSchema,
    default: {
      privacy: "public",
      darkMode: false,
      language: "en",
      notifications: true,
    },
  },
  flowpageLinks: {
    type: [
      {
        type: {
          type: String,
          enum: [
            "Instagram",
            "X",
            "Facebook",
            "Snapchat",
            "YouTube",
            "TikTok",
            "Apple Music",
            "Spotify",
          ],
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    validate: [
      {
        validator: function (array) {
          return array.length <= 8;
        },
        message: "Cannot have more than 8 Flow Page Links.",
      },
    ],
  },
});

// Hashes Password
userSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("password")) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Checks if Password is Correct
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Create User Model
const User = model("User", userSchema);

export default User;
