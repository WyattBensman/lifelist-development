import { Experience } from "../../../../models/index.mjs";

export const getExperience = async (_, { experienceId }) => {
  try {
    const experience = await Experience.findById(experienceId);

    if (!experience) {
      throw new Error("Experience not found.");
    }

    return experience;
  } catch (error) {
    throw new Error(`Error fetching experience by ID: ${error.message}`);
  }
};
