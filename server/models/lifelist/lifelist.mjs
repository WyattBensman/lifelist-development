import { Schema, model } from "mongoose";

const lifeListSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  experiences: [
    {
      experience: {
        type: Schema.Types.ObjectId,
        ref: "Experience",
      },
      list: {
        type: String,
        enum: ["EXPERIENCED", "WISHLISTED"],
        required: true,
      },
      associatedCollages: [
        {
          type: Schema.Types.ObjectId,
          ref: "Collage",
        },
      ],
    },
  ],
});

const LifeList = model("LifeList", lifeListSchema);

export default LifeList;
