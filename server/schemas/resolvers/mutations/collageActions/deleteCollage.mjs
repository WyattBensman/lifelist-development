import {
  Collage,
  User,
  Comment,
  Notification,
} from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const deleteCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);
    // Ensure the user is the author and the collage exists
    await isCurrentAuthor(user, collageId);

    // Remove collage from all users' lists and related data
    await User.updateMany(
      {},
      {
        $pull: {
          savedCollages: collageId,
          likedCollages: collageId,
          repostedCollages: collageId,
          collages: collageId,
          taggedCollages: collageId,
        },
      }
    );

    // Delete all comments and notifications associated with the collage
    await Comment.deleteMany({ collage: collageId });
    await Notification.deleteMany({ collage: collageId });

    // Delete the image files associated with the collage
    if (collage.images && collage.images.length > 0) {
      collage.images.forEach((imagePath) => {
        const fullPath = path.join(imagePath); // Ensure this path is correct
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error("Failed to delete image file:", err);
          }
        });
      });
    }

    // Delete the collage
    await Collage.findByIdAndDelete(collageId);

    return {
      success: true,
      message: "Collage successfully deleted.",
      action: "DELETE_COLLAGE",
    };
  } catch (error) {
    console.error(`Delete Collage Error: ${error.message}`);
    throw new Error("An error occurred during collage deletion.");
  }
};

export default deleteCollage;
