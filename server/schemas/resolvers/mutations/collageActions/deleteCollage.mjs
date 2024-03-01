import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const deleteCollage = async (_, { collageId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author
    await isCurrentAuthor(user, collageId);

    // Remove the collage from the current user's collages
    await User.findByIdAndUpdate(user._id, {
      $pull: { collages: collageId },
    });

    // Remove the collage from the taggedCollages field of users who were tagged
    await User.updateMany(
      { _id: { $in: collage.tagged } },
      { $pull: { taggedCollages: collageId } }
    );

    // Remove the collage from the repostedCollages field of users who reposted it
    await User.updateMany(
      { _id: { $in: collage.reposts } },
      { $pull: { repostedCollages: collageId } }
    );

    // Remove the collage from the savedCollages field of users who saved it
    await User.updateMany(
      { _id: { $in: collage.savedCollages } },
      { $pull: { savedCollages: collageId } }
    );

    // Delete all comments associated with the collage
    await Comment.deleteMany({ _id: { $in: collage.comments } });

    // Delete the collage
    await Collage.findByIdAndDelete(collageId);

    return "Collage deleted successfully.";
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while deleting the collage.");
  }
};

export default deleteCollage;
