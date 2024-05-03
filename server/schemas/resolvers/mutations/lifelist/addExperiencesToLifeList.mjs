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

    // Create LifeListExperience documents for each experience provided
    const lifeListExperiences = await Promise.all(
      experiences.map((exp) =>
        LifeListExperience.create({
          lifeList: lifeListId,
          experience: exp.experienceId,
          list: exp.list,
        })
      )
    );

    // Fetch the LifeList and append the new experiences
    const lifeList = await LifeList.findById(lifeListId);
    lifeList.experiences.push(...lifeListExperiences.map((exp) => exp._id));
    await lifeList.save();

    return lifeList; // Return the updated LifeList
  } catch (error) {
    console.error(`Error adding experiences to LifeList: ${error.message}`);
    throw new Error("Failed to add experiences to LifeList.");
  }
};

export default addExperiencesToLifeList;
