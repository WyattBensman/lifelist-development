import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const unarchiveCollage = async (_, { collageId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author
    await isCurrentAuthor(user, collageId);

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
