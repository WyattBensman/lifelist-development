import { Experience, Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const addExperienceToLifeList = async (
  _,
  { experienceId, list, collageIds },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the experience exists
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      throw new Error("Experience not found.");
    }

    // Check if the experience is already in the user's lifeList
    const isAlreadyInLifeList = await User.findOne({
      _id: user._id,
      lifeList: {
        $elemMatch: { experience: experienceId },
      },
    });

    if (isAlreadyInLifeList) {
      throw new Error("Experience is already in the LifeList.");
    }

    // Update the user's lifeList with the array of collageIds
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          lifeList: {
            experience: experienceId,
            list,
            associatedCollages: collageIds,
          },
        },
      },
      { new: true }
    );

    return updatedUser.lifeList;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during adding experience to life list.");
  }
};

export default addExperienceToLifeList;
