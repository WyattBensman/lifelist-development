import { LifeList } from "../../../../models/index.mjs";
import { isUser, isCurrentLifeListAuthor } from "../../../../utils/auth.mjs";

const removeCollagesFromExperienceInLifeList = async (
  _,
  { lifeListId, experienceId, collageIds },
  { user }
) => {
  try {
    isUser(user);
    await isCurrentLifeListAuthor(user, lifeListId);

    // Update the specific experience in the LifeList to remove collages
    const updatedLifeList = await LifeList.findOneAndUpdate(
      { _id: lifeListId, "experiences.experience": experienceId },
      {
        $pullAll: {
          "experiences.$.associatedCollages": collageIds,
        },
      },
      { new: true }
    ).populate("experiences.experience");

    return updatedLifeList;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during removing collage from experience in life list."
    );
  }
};

export default removeCollagesFromExperienceInLifeList;
