import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const tagUsers = async (_, { collageId, taggedUserIds }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author
    await isCurrentAuthor(user, collageId);

    // Validate that the tagged users exist
    const taggedUsers = await User.find({ _id: { $in: taggedUserIds } });
    if (taggedUsers.length !== taggedUserIds.length) {
      throw new Error("One or more tagged users not found.");
    }

    // Update tagged users for the collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $addToSet: { tagged: { $each: taggedUserIds } } },
      { new: true, runValidators: true }
    ).populate({
      path: "tagged",
      select: "fullName profilePicture username",
    });

    return {
      success: true,
      message: "Users tagged successfully",
      collageId: collageId,
      taggedUsers: updatedCollage.tagged,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while setting the tagged users.");
  }
};

export default tagUsers;
