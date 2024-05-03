import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const untagUsers = async (_, { collageId, userIds }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Find the collage and remove tagged users
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $pull: { tagged: { $in: userIds } } },
      { new: true }
    );

    // Check if the collage exists
    if (!updatedCollage) {
      throw new Error("Collage not found.");
    }

    // Return success message with the collage ID
    return {
      success: true,
      message: "Users untagged successfully",
      collageId: collageId,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while untagging users.");
  }
};

export default untagUsers;
