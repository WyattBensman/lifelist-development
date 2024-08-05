import { Schema, model } from "mongoose";

const experienceSchema = new Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
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
      "TRAILS",
      "RESORTS",
      "CONCERTS",
      "PERFORMERS",
    ],
    required: true,
  },
  subCategory: {
    type: String,
    enum: [
      "ATTRACTION",
      "CONCERT",
      "DESTINATION",
      "SPORTING_EVENT",
      "THEATRE_AND_PERFORMING_ARTS_EVENT",
      "PARADE",
      "MUSIC_FESTIVAL",
      "CULTURAL_FESTIVAL",
      "RELIGIOUS_FESTIVAL",
      "FOOD_AND_DRINK_FESTIVAL",
      "ART_FESTIVAL",
      "HISTORICAL_FESTIVAL",
      "FLOWER_FESTIVAL",
      "SEASONAL_FESTIVAL",
      "TRAIL",
      "MOUNTAIN_RESORT",
      "BEACH_RESORT",
      "GOLF_RESORT",
      "ISLAND_RESORT",
      "VENUE",
      "ARTIST",
      "COMEDIAN",
      "GOLF_COURSE",
      "FOOTBALL",
      "BASKETBALL",
      "BASEBALL",
      "VOLLEYBALL",
      "SOCCER",
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
