import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const addCollageToExperienceInLifeList = async (
  _,
  { experienceId, collageId },
  { user }
) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the current user is the creator of the collage
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

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

export default addCollageToExperienceInLifeList;
