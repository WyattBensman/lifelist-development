import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const removeExperienceFromLifeList = async (_, { experienceId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the experience exists in the user's lifeList
    const experienceToRemove = user.lifeList.find((item) =>
      item.experience.equals(experienceId)
    );

    if (!experienceToRemove) {
      throw new Error("Experience not found in the user's LifeList.");
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
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

export default removeExperienceFromLifeList;
