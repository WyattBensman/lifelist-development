import { Schema, model } from "mongoose";

const lifeListSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  experiences: [
    {
      type: Schema.Types.ObjectId,
      ref: "LifeListExperience",
    },
  ],
});

const LifeList = model("LifeList", lifeListSchema);

export default LifeList;
