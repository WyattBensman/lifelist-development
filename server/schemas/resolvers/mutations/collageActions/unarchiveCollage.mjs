import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const unarchiveCollage = async (_, { collageId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Unarchive the collage
    const unarchivedCollage = await Collage.findByIdAndUpdate(collageId, {
      archived: false,
    });

    // Remove the collage to the user's archivedCollages field
    await User.findByIdAndUpdate(user._id, {
      $pull: { archivedCollages: collageId },
    });

    return unarchivedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while unarchiving the collage.");
  }
};

export default unarchiveCollage;
