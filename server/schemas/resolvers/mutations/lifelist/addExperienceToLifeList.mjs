import { Experience, Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const addExperienceToLifeList = async (
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

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        $push: {
          lifeList: {
            experience: experienceId,
            list,
            associatedCollages: collageIds.map((collageId) => ({
              collage: collageId,
            })),
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
