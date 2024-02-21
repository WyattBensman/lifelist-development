import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const removeExperienceFromLifeList = async (
  _,
  { experienceId },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        $pull: {
          lifeList: { experience: experienceId },
        },
      },
      { new: true }
    );

    return updatedUser.lifeList;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during removing experience from life list."
    );
  }
};
