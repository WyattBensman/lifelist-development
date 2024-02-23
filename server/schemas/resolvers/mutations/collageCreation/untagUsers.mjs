import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const untagUsers = async (_, { collageId, userIdsToUntag }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Retrieve the collage and check if the user is the author
    const collage = await Collage.findById(collageId);
    isCurrentAuthor(user, collage.author);

    // Update tagged users for the collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $pull: { tagged: { $in: userIdsToUntag } } },
      { new: true, runValidators: true }
    );

    // Remove the collage from the taggedCollages field for each untagged user
    await User.updateMany(
      { _id: { $in: userIdsToUntag } },
      { $pull: { taggedCollages: collageId } }
    );

    return updatedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while untagging users.");
  }
};

export default untagUsers;
