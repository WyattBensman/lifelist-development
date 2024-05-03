import { LifeListExperience } from "../../../../models/index.mjs";

const addCollagesToLifeListExperience = async (
  _,
  { lifeListExperienceId, collageIds },
  { user }
) => {
  try {
    // Retrieve the LifeListExperience and validate existence
    const lifeListExperience = await LifeListExperience.findById(
      lifeListExperienceId
    );
    if (!lifeListExperience) {
      throw new Error("LifeListExperience not found.");
    }

    // Append new collages to the associatedCollages array
    lifeListExperience.associatedCollages.push(...collageIds);
    await lifeListExperience.save();

    return lifeListExperience; // Return the updated LifeListExperience
  } catch (error) {
    console.error(
      `Error adding collages to LifeListExperience: ${error.message}`
    );
    throw new Error("Failed to add collages to LifeListExperience.");
  }
};

export default addCollagesToLifeListExperience;
