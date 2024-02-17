import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const updateExperienceStatusInLifeList = async (
  _,
  { experienceId, newList },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    await User.updateOne(
      { _id: user.id, "lifeList.experience": experienceId },
      { $set: { "lifeList.$.list": newList } }
    );

    return {
      message: "Experience status updated successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during updating experience status in life list."
    );
  }
};
