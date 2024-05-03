import { Collage } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const tagUsers = async (_, { collageId, userIds }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Find the collage and update tagged users
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $addToSet: { tagged: { $each: userIds } } },
      { new: true }
    );

    // Check if the collage exists
    if (!updatedCollage) {
      throw new Error("Collage not found.");
    }

    // Return success message with the collage ID
    return {
      success: true,
      message: "Users tagged successfully",
      collageId: collageId,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while tagging users.");
  }
};

export default tagUsers;
