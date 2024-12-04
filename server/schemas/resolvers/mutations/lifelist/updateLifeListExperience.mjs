import { LifeListExperience } from "../../../../models/index.mjs";

const updateLifeListExperience = async (
  _,
  { lifeListExperienceId, list, associatedShots }
) => {
  try {
    // Fetch the LifeListExperience document by its ID
    const lifeListExperience = await LifeListExperience.findById(
      lifeListExperienceId
    );

    if (!lifeListExperience) {
      throw new Error("LifeListExperience not found.");
    }

    // Update the list and associatedShots fields
    if (list) {
      lifeListExperience.list = list;
    }

    if (associatedShots) {
      lifeListExperience.associatedShots = Array.isArray(associatedShots)
        ? associatedShots
        : [];
    }

    // Save the updated document
    await lifeListExperience.save();

    return {
      success: true,
      message: "LifeListExperience successfully updated.",
    };
  } catch (error) {
    console.error(`Error updating LifeListExperience: ${error.message}`);
    throw new Error("Failed to update LifeListExperience.");
  }
};

export default updateLifeListExperience;
