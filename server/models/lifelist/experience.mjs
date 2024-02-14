import { Schema, model } from "mongoose";

const experienceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    type: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
  types: {
    type: [String],
    enum: [
      "Attractions",
      "Destinations",
      "Events",
      "Courses",
      "Venues",
      "Festivals",
      "Hikes & Trails",
      "Resorts",
      "Concerts",
      "Artists",
    ],
    required: true,
  },
  collages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Collage",
    },
  ],
});

const Experience = model("Experience", experienceSchema);

export default Experience;
