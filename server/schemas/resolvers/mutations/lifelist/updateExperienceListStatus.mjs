import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const updateExperienceListStatus = async (
  _,
  { experienceId, newList },
  { user }
) => {
  try {
    // Check if the user is authenticated
    /* isUser(user); */

    const user = User.findById("65e08edb5242a6c8ff3c8152");

    // Check if the experience exists in the user's lifeList
    const experienceToUpdate = user.lifeList.find((item) =>
      item.experience.equals(experienceId)
    );

    if (!experienceToUpdate) {
      throw new Error("Experience not found in the user's LifeList.");
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, "lifeList.experience": experienceId },
      { $set: { "lifeList.$.list": newList } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found.");
    }

    return updatedUser.lifeList;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during updating experience status in life list."
    );
  }
};

export default updateExperienceListStatus;
