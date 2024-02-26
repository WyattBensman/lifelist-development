import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const removeCollageFromExperienceInLifeList = async (
  _,
  { experienceId, collageId },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, "lifeList.experience": experienceId },
      { $pull: { "lifeList.$.associatedCollages": collageId } },
      { new: true }
    );

    return updatedUser.lifeList;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during removing collage from experience in life list."
    );
  }
};

export default removeCollageFromExperienceInLifeList;
