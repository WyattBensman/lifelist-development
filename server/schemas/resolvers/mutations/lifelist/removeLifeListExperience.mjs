import { LifeList, LifeListExperience } from "../../../../models/index.mjs";

const removeLifeListExperience = async (
  _,
  { lifeListId, lifeListExperienceId }
) => {
  try {
    // Ensure the LifeList exists
    const lifeList = await LifeList.findById(lifeListId);
    if (!lifeList) {
      throw new Error("LifeList not found.");
    }

    // Remove the specified experience from the LifeListExperience collection
    const deletedExperience = await LifeListExperience.deleteOne({
      _id: lifeListExperienceId,
      lifeList: lifeListId,
    });

    if (deletedExperience.deletedCount === 0) {
      throw new Error("LifeListExperience not found or already removed.");
    }

    // Update the LifeList's experiences array using $pull
    await LifeList.updateOne(
      { _id: lifeListId },
      { $pull: { experiences: lifeListExperienceId } }
    );

    return {
      success: true,
      message: "LifeListExperience successfully removed.",
    };
  } catch (error) {
    console.error(`Error removing LifeListExperience: ${error.message}`);
    throw new Error("Failed to remove LifeListExperience.");
  }
};

export default removeLifeListExperience;
