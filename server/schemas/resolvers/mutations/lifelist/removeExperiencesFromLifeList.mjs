import { LifeList, LifeListExperience } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const removeExperiencesFromLifeList = async (
  _,
  { lifeListId, lifeListExperienceIds },
  { user }
) => {
  try {
    // Ensure the user is authenticated
    isUser(user);

    // Find the LifeList by ID and ensure it belongs to the user
    const lifeList = await LifeList.findOne({
      _id: lifeListId,
      author: user._id,
    });
    if (!lifeList) {
      throw new Error(
        "LifeList not found or you do not have permission to modify it."
      );
    }

    // Remove the specified experiences from the LifeList
    await LifeListExperience.deleteMany({
      _id: { $in: lifeListExperienceIds },
      lifeList: lifeListId,
    });

    // Update the LifeList's experiences array
    lifeList.experiences = lifeList.experiences.filter(
      (expId) => !lifeListExperienceIds.includes(expId.toString())
    );
    await lifeList.save();

    return {
      success: true,
      message: "Experiences successfully removed",
    };
  } catch (error) {
    console.error(`Error removing experiences from LifeList: ${error.message}`);
    throw new Error("Failed to remove experiences from LifeList.");
  }
};

export default removeExperiencesFromLifeList;
