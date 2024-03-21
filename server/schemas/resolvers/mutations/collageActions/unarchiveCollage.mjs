import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const unarchiveCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Unarchive the collage
    const unarchivedCollage = await Collage.findByIdAndUpdate(collageId, {
      archived: false,
    });

    // Remove the collage to the user's archivedCollages field
    await User.findByIdAndUpdate(user._id, {
      $pull: { archivedCollages: collageId },
    });

    return {
      success: true,
      message: "Successfully archived collage.",
      action: "UNARCHIVE",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while unarchiving the collage.");
  }
};

export default unarchiveCollage;
