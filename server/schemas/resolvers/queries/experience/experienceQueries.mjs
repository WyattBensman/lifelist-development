import { Experience } from "../../../../models/index.mjs";

export const getExperience = async (_, { experienceId }) => {
  const experience = await Experience.findById(experienceId).exec();
  if (!experience) throw new Error("Experience not found.");
  return experience;
};
