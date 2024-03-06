import { LifeList } from "../../../../models/index.mjs";
import { isUser, isCurrentLifeListAuthor } from "../../../../utils/auth.mjs";

const updateExperienceListStatus = async (
  _,
  { lifeListId, experienceId, newListStatus },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author of the LifeList
    await isCurrentLifeListAuthor(user, lifeListId);

    // Use findOneAndUpdate to update the specific experience's list status
    const updatedLifeList = await LifeList.findOneAndUpdate(
      {
        _id: lifeListId,
        "experiences.experience": experienceId,
      },
      {
        $set: {
          "experiences.$.list": newListStatus,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("experiences.experience");

    if (!updatedLifeList) {
      throw new Error(
        `LifeList not found or experience not found in the LifeList.`
      );
    }

    return updatedLifeList;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during updating experience status in life list."
    );
  }
};

export default updateExperienceListStatus;
