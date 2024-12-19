import { Schema } from "mongoose";

const reportSchema = new Schema({
  reporter: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    enum: [
      // Existing reasons
      "INAPPROPRIATE_CONTENT",
      "COPYRIGHT_VIOLATION",
      "HARASSMENT_OR_BULLYING",
      "FALSE_INFORMATION_OR_MISREPRESENTATION",
      "VIOLATES_COMMUNITY_GUIDELINES",
      "SPAM_OR_SCAMS",
      "NUDITY_OR_SEXUAL_CONTENT",

      // User-specific reasons
      "IMPERSONATION",
      "UNSOLICITED_CONTACT",
      "HATE_SPEECH_OR_DISCRIMINATION",
      "UNDERAGE_ACCOUNT",
      "UNAUTHORIZED_ACTIVITY",
      "OTHER",
    ],
    required: true,
  },
});

export default reportSchema;
