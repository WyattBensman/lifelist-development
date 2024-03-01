import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const archiveCollage = async (_, { collageId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author
    await isCurrentAuthor(user, collageId);

    // Archive the collage
    const archivedCollage = await Collage.findByIdAndUpdate(collageId, {
      archived: true,
    });

    // Add the collage to the user's archivedCollages field
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { archivedCollages: collageId },
    });

    return archivedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while archiving the collage.");
  }
};

export default archiveCollage;
