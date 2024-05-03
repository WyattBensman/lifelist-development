import { LifeListExperience } from "../../../../models/index.mjs";

const removeCollagesFromLifeListExperience = async (
  _,
  { lifeListExperienceId, collageIds },
  { user }
) => {
  try {
    // Fetch the specified LifeListExperience
    const lifeListExperience = await LifeListExperience.findById(
      lifeListExperienceId
    );
    if (!lifeListExperience) {
      throw new Error("LifeListExperience not found.");
    }

    // Filter out the specified collages from the associatedCollages array
    lifeListExperience.associatedCollages =
      lifeListExperience.associatedCollages.filter(
        (id) => !collageIds.includes(id.toString())
      );
    await lifeListExperience.save();

    return lifeListExperience; // Return the modified LifeListExperience
  } catch (error) {
    console.error(
      `Error removing collages from LifeListExperience: ${error.message}`
    );
    throw new Error("Failed to remove collages from LifeListExperience.");
  }
};

export default removeCollagesFromLifeListExperience;
