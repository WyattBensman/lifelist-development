import { Experience } from "../../../../models/index.mjs";

export const getExperience = async (_, { experienceId }) => {
  const experience = await Experience.findById(experienceId).exec();
  if (!experience) throw new Error("Experience not found.");
  return experience;
};

export const getAllExperiences = async () => {
  const experiences = await Experience.find().exec();
  return experiences;
};
