import { LifeList } from "../../../../models/index.mjs";
import { isCurrentLifeListAuthor, isUser } from "../../../../utils/auth.mjs";

const addExperiencesToLifeList = async (
  _,
  { lifeListId, experiences },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author of the LifeList
    await isCurrentLifeListAuthor(user, lifeListId);

    const lifeList = await LifeList.findById(lifeListId);

    // Loop through the experiences and add them to the LifeList
    experiences.forEach(async (exp) => {
      const { experience, list } = exp;

      const isExperienceAlreadyAdded = lifeList.experiences.some(
        (existingExp) => existingExp.experience.toString() === experience
      );

      if (!isExperienceAlreadyAdded) {
        // Create a new experience entry
        const newExperience = {
          experience,
          list,
        };

        // Add the experience to the LifeList
        lifeList.experiences.push(newExperience);
      } else {
        console.error(
          `Error: Experience with ID ${experience} is already in the LifeList.`
        );
      }
    });

    await lifeList.save();

    return LifeList.findById(lifeListId).populate("experiences.experience");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during adding experience to life list.");
  }
};

export default addExperiencesToLifeList;
