import { Experience } from "../../../../models/index.mjs";

export const getExperience = async (_, { experienceId }) => {
  const experience = await Experience.findById(experienceId).exec();
  if (!experience) throw new Error("Experience not found.");
  return experience;
};

export const getAllExperiences = async (_, { limit, offset }) => {
  try {
    const experiences = await Experience.find({})
      .skip(offset)
      .limit(limit)
      .exec();
    return experiences;
  } catch (error) {
    throw new Error("Failed to fetch experiences");
  }
};
