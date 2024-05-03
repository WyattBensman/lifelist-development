import { LifeListExperience } from "../../../../models/index.mjs";

const addShotsToLifeListExperience = async (
  _,
  { lifeListExperienceId, shotIds },
  { user }
) => {
  try {
    // Locate the relevant LifeListExperience
    const lifeListExperience = await LifeListExperience.findById(
      lifeListExperienceId
    );
    if (!lifeListExperience) {
      throw new Error("LifeListExperience not found.");
    }

    // Add camera shots to the associatedShots array
    lifeListExperience.associatedShots.push(...shotIds);
    await lifeListExperience.save();

    return lifeListExperience; // Return the updated LifeListExperience
  } catch (error) {
    console.error(`Error adding shots to LifeListExperience: ${error.message}`);
    throw new Error("Failed to add shots to LifeListExperience.");
  }
};

export default addShotsToLifeListExperience;
