import { LifeList, LifeListExperience } from "../../../../models/index.mjs";
import { isLifeListAuthor } from "../../../../utils/auth.mjs";

const removeExperiencesFromLifeList = async (
  _,
  { lifeListId, experienceIds },
  { user }
) => {
  try {
    // Ensure the user is authorized to modify the LifeList
    await isLifeListAuthor(user, lifeListId);

    // Delete the specified LifeListExperience documents
    await LifeListExperience.deleteMany({ _id: { $in: experienceIds } });

    // Update the LifeList to remove the deleted experiences
    const lifeList = await LifeList.findById(lifeListId);
    lifeList.experiences = lifeList.experiences.filter(
      (id) => !experienceIds.includes(id.toString())
    );
    await lifeList.save();

    return lifeList; // Return the modified LifeList
  } catch (error) {
    console.error(`Error removing experiences from LifeList: ${error.message}`);
    throw new Error("Failed to remove experiences from LifeList.");
  }
};

export default removeExperiencesFromLifeList;
