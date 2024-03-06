import { LifeList } from "../../../../models/index.mjs";
import { isUser, isCurrentLifeListAuthor } from "../../../../utils/auth.mjs";

const removeExperiencesFromLifeList = async (
  _,
  { lifeListId, experienceIds },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author of the LifeList
    await isCurrentLifeListAuthor(user, lifeListId);

    const lifeList = await LifeList.findById(lifeListId);

    // Filter out experiences to be removed
    lifeList.experiences = lifeList.experiences.filter(
      (existingExp) =>
        !experienceIds.includes(existingExp.experience.toString())
    );

    await lifeList.save();

    return LifeList.findById(lifeListId).populate("experiences.experience");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during removing experience from life list."
    );
  }
};

export default removeExperiencesFromLifeList;
