import { User, LifeList } from "../../../../models/index.mjs";
import { isUser, isCurrentLifeListAuthor } from "../../../../utils/auth.mjs";

const addCollagesToExperienceInLifeList = async (
  _,
  { lifeListId, experienceId, collageIds },
  { user }
) => {
  try {
    isUser(user);
    await isCurrentLifeListAuthor(user, lifeListId);

    // Update the specific experience in the LifeList
    const updatedLifeList = await LifeList.findOneAndUpdate(
      { _id: lifeListId, "experiences.experience": experienceId },
      {
        $addToSet: {
          "experiences.$.associatedCollages": { $each: collageIds },
        },
      },
      { new: true }
    ).populate("experiences.experience");

    return updatedLifeList;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during adding collage to experience in life list."
    );
  }
};

export default addCollagesToExperienceInLifeList;
