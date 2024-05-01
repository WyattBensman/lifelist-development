import { Schema, model } from "mongoose";

const experienceSchema = new Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  location: {
    type: String,
  },
  coordinates: {
    type: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
  },
  category: {
    type: String,
    enum: [
      "ATTRACTIONS",
      "DESTINATIONS",
      "EVENTS",
      "COURSES",
      "VENUES",
      "FESTIVALS",
      "HIKES_AND_TRAILS",
      "RESORTS",
      "CONCERTS",
      "ARTISTS",
    ],
  },
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
});

const Experience = model("Experience", experienceSchema);

export default Experience;
