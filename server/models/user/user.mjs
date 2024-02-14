import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const validatePassword = (value) => {
  return /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/.test(value);
};

const validateEmail = (value) => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
};

const validatePhoneNumber = (value) => {
  return /^\d{10}$/.test(value);
};

const userSchema = new new Schema({
  fName: {
    type: String,
    required: true,
    trim: true,
  },
  lName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
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
  password: {
    type: String,
    required: true,
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
    required: true,
    minlength: 5,
    maxlength: 24,
    lowercase: true,
    match: /^[a-zA-Z]{5}[a-zA-Z0-9._-]*$/,
  },
  bio: {
    type: String,
    maxlength: 150,
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
  gender: {
    type: String,
    enum: ["Male", "Female", "Prefer not to say"],
  },
  birthday: {
    type: Date,
    required: true,
    validate: {
      validator: (date) => !isNaN(date.getTime()),
      message: "Invalid date format.",
    },
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
  followerRequests: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  ],
  lifeList: [
    {
      lifeListItem: {
        type: Schema.Types.ObjectId,
        ref: "LifeListItem",
      },
      list: {
        type: String,
        enum: ["experienced", "wishListed"],
      },
    },
  ],
  collages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Collage",
    },
  ],
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
  settings: {
    type: userSettingsSchema,
    default: {},
  },
})();

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
