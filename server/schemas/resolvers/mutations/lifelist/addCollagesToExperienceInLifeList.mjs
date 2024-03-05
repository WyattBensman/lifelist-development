import { User, Experience } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const addCollagesToExperienceInLifeList = async (
  _,
  { experienceId, collageIds },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author of the LifeList
    await isCurrentLifeListAuthor(user, lifeListId);

    // Check if the collage is already associated with the experience
    const isCollageAlreadyAssociated = await Experience.exists({
      _id: experienceId,
      "associatedCollages.collage": collageId,
    });

    if (isCollageAlreadyAssociated) {
      throw new Error("Collage is already associated with the experience.");
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        "lifeList.experience": experienceId,
      },
      { $push: { "lifeList.$.associatedCollages": collageId } },
      { new: true }
    );

    return updatedUser.lifeList;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during adding collage to experience in life list."
    );
  }
};

export default addCollagesToExperienceInLifeList;
