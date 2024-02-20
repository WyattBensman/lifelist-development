import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

export const tagUsers = async (_, { collageId, taggedUserIds }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Validate that the tagged users exist
    const taggedUsers = await User.find({ _id: { $in: taggedUserIds } });
    if (taggedUsers.length !== taggedUserIds.length) {
      throw new Error("One or more tagged users not found.");
    }

    // Update tagged users for the collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $set: { tagged: taggedUserIds } },
      { new: true, runValidators: true }
    );

    return {
      message: "Tagged users set successfully.",
      updatedCollage,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while setting the tagged users.");
  }
};