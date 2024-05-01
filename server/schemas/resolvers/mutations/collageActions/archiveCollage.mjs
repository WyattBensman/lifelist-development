import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const archiveCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    await Collage.findByIdAndUpdate(collageId, { archived: true });
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { archivedCollages: collageId },
    });

    return {
      success: true,
      message: "Collage successfully archived.",
    };
  } catch (error) {
    console.error(`Error archiving collage: ${error.message}`);
    throw new Error("Failed to archive collage.");
  }
};

export default archiveCollage;
