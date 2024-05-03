import { LifeListExperience } from "../../../../models/index.mjs";

const updateLifeListExperienceListStatus = async (
  _,
  { lifeListExperienceId, newListStatus },
  { user }
) => {
  try {
    // Find the LifeListExperience and ensure it exists
    const lifeListExperience = await LifeListExperience.findById(
      lifeListExperienceId
    );
    if (!lifeListExperience) {
      throw new Error("LifeListExperience not found.");
    }

    // Update the list status of the LifeListExperience
    lifeListExperience.list = newListStatus;
    await lifeListExperience.save();

    return lifeListExperience; // Return the updated LifeListExperience
  } catch (error) {
    console.error(
      `Error updating LifeListExperience list status: ${error.message}`
    );
    throw new Error("Failed to update LifeListExperience list status.");
  }
};

export default updateLifeListExperienceListStatus;
