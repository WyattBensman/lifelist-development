import { LifeList, LifeListExperience } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const removeExperienceFromLifeList = async (
  _,
  { lifeListId, lifeListExperienceId },
  { user }
) => {
  try {
    // Ensure the user is authenticated
    isUser(user);

    // Remove the specified experience from the LifeListExperience collection
    await LifeListExperience.deleteOne({
      _id: lifeListExperienceId,
      lifeList: lifeListId,
    });

    // Update the LifeList's experiences array using $pull
    await LifeList.updateOne(
      { _id: lifeListId },
      { $pull: { experiences: lifeListExperienceId } }
    );

    return {
      success: true,
      message: "Experiences successfully removed",
    };
  } catch (error) {
    console.error(`Error removing experiences from LifeList: ${error.message}`);
    throw new Error("Failed to remove experiences from LifeList.");
  }
};

export default removeExperienceFromLifeList;
