import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const tagUsers = async (_, { collageId, taggedUserIds }, { user }) => {
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

    // Add the collage to the taggedCollages field for each tagged user
    await User.updateMany(
      { _id: { $in: taggedUserIds } },
      { $addToSet: { taggedCollages: collageId } }
    );

    return updatedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while setting the tagged users.");
  }
};

export default tagUsers;
