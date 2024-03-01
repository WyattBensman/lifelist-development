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
