import { LifeList, LifeListExperience } from "../../../../models/index.mjs";

const addLifeListExperience = async (
  _,
  { lifeListId, experienceId, list, associatedShots = [] }
) => {
  try {
    // Fetch the existing LifeList to check current experiences
    const lifeList = await LifeList.findById(lifeListId).populate(
      "experiences"
    );

    if (!lifeList) {
      throw new Error("LifeList not found for the specified ID.");
    }

    // Check if the experience is already in the LifeList
    const existingExperienceIds = new Set(
      lifeList.experiences.map((exp) => exp.experience.toString())
    );

    if (existingExperienceIds.has(experienceId)) {
      throw new Error("Experience is already in the LifeList.");
    }

    // Create a new LifeListExperience document
    const lifeListExperience = await LifeListExperience.create({
      lifeList: lifeListId,
      experience: experienceId,
      list,
      associatedShots, // Directly set associatedShots
    });

    // Append the new experience to the LifeList
    lifeList.experiences.push(lifeListExperience._id);
    await lifeList.save();

    return {
      success: true,
      message: "Experience successfully added to LifeList.",
      lifeListExperienceId: lifeListExperience._id, // Include the generated ID
    };
  } catch (error) {
    console.error(`Error adding experience to LifeList: ${error.message}`);
    throw new Error("Failed to add experience to LifeList.");
  }
};

export default addLifeListExperience;
