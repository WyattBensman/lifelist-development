import { LifeListExperience } from "../../../../models/index.mjs";

const removeShotsFromLifeListExperience = async (
  _,
  { lifeListExperienceId, shotIds },
  { user }
) => {
  try {
    // Locate the LifeListExperience for update
    const lifeListExperience = await LifeListExperience.findById(
      lifeListExperienceId
    );
    if (!lifeListExperience) {
      throw new Error("LifeListExperience not found.");
    }

    // Remove specified shots from the associatedShots array
    lifeListExperience.associatedShots =
      lifeListExperience.associatedShots.filter(
        (id) => !shotIds.includes(id.toString())
      );
    await lifeListExperience.save();

    return lifeListExperience; // Return the updated LifeListExperience
  } catch (error) {
    console.error(
      `Error removing shots from LifeListExperience: ${error.message}`
    );
    throw new Error("Failed to remove shots from LifeListExperience.");
  }
};

export default removeShotsFromLifeListExperience;
