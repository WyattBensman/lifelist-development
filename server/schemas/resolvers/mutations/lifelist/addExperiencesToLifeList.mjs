import { LifeList, LifeListExperience } from "../../../../models/index.mjs";
import { isLifeListAuthor } from "../../../../utils/auth.mjs";

const addExperiencesToLifeList = async (
  _,
  { lifeListId, experiences },
  { user }
) => {
  try {
    // Verify if the user is authorized to modify the specified LifeList
    await isLifeListAuthor(user, lifeListId);

    // Fetch the existing LifeList to check current experiences
    const lifeList = await LifeList.findById(lifeListId).populate(
      "experiences"
    );
    if (!lifeList) {
      throw new Error("LifeList not found.");
    }

    // Get current experience IDs to prevent duplicates
    const existingExperienceIds = new Set(
      lifeList.experiences.map((exp) => exp.experience.toString())
    );

    // Filter out experiences that are already in the LifeList
    const newExperiences = experiences.filter(
      (exp) => !existingExperienceIds.has(exp.experienceId)
    );

    // Create LifeListExperience documents for new experiences
    const lifeListExperiences = await Promise.all(
      newExperiences.map((exp) =>
        LifeListExperience.create({
          lifeList: lifeListId,
          experience: exp.experienceId,
          list: exp.list,
        })
      )
    );

    // Append the new experiences if there are any
    if (lifeListExperiences.length > 0) {
      lifeList.experiences.push(...lifeListExperiences.map((exp) => exp._id));
      await lifeList.save();
    }

    return lifeList;
  } catch (error) {
    console.error(`Error adding experiences to LifeList: ${error.message}`);
    throw new Error("Failed to add experiences to LifeList.");
  }
};

export default addExperiencesToLifeList;
