import { Schema, model } from "mongoose";

const lifeListExperienceSchema = new Schema({
  lifeList: {
    type: Schema.Types.ObjectId,
    ref: "LifeList",
  },
  experience: {
    type: Schema.Types.ObjectId,
    ref: "Experience",
    required: true,
  },
  list: {
    type: String,
    enum: ["EXPERIENCED", "WISHLISTED"],
  },
  associatedShots: [
    {
      type: Schema.Types.ObjectId,
      ref: "CameraShot",
    },
  ],
  year: {
    type: Number,
  },
  venue: {
    type: Schema.Types.ObjectId,
    ref: "Experience",
  },
  performers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Experience",
    },
  ],
  opponent: {
    type: Schema.Types.ObjectId,
    ref: "Experience",
  },
  score: {
    type: Map,
    of: Number,
  },
});

const LifeListExperience = model(
  "LifeListExperience",
  lifeListExperienceSchema
);

export default LifeListExperience;
