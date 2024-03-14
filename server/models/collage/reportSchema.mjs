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
      "INAPPROPRIATE_CONTENT",
      "COPYRIGHT_VIOLATION",
      "HARASSMENT_OR_BULLYING",
      "FALSE_INFORMATION_OR_MISREPRESENTATION",
      "VIOLATES_COMMUNITY_GUIDELINES",
      "SPAM_OR_SCAMS",
    ],
    required: true,
  },
});

export default reportSchema;
