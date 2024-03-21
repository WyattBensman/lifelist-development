import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const archiveCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Archive the collage
    const archivedCollage = await Collage.findByIdAndUpdate(collageId, {
      archived: true,
    });

    // Add the collage to the user's archivedCollages field
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { archivedCollages: collageId },
    });

    return {
      success: true,
      message: "Successfully archived collage.",
      action: "ARCHIVE",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while archiving the collage.");
  }
};

export default archiveCollage;
