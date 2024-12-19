import { User, Collage } from "../../../../models/index.mjs";
import { isUser, findCollageById } from "../../../../utils/auth.mjs";

const archiveCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);

    const updatedUser = await User.findByIdAndUpdate(
      user,
      { $addToSet: { archivedCollages: collageId } },
      { new: true }
    );

    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $set: { archived: true } },
      { new: true }
    );

    if (!updatedUser || !updatedCollage) {
      throw new Error("Failed to archive collage.");
    }

    return {
      success: true,
      message: "Collage successfully archived.",
      collageId: collageId,
    };
  } catch (error) {
    throw new Error("An error occurred while archiving the collage.");
  }
};

export default archiveCollage;
