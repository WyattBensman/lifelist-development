import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

export const removeCollageFromExperienceInLifeList = async (
  _,
  { experienceId, collageId },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    const updatedUser = await User.updateOne(
      { _id: user.id, "lifeList.experience": experienceId },
      { $pull: { "lifeList.$.associatedCollages": { collage: collageId } } }
    );

    return updatedUser.lifeList;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during removing collage from experience in life list."
    );
  }
};
