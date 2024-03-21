import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";

const untagUsers = async (_, { collageId, userIdsToUntag }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    // Update tagged users for the collage
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $pull: { tagged: { $in: userIdsToUntag } } },
      { new: true, runValidators: true }
    ).populate({
      path: "tagged",
      select: "fullName profilePicture username",
    });

    // Remove the collage from the taggedCollages field for each untagged user
    await User.updateMany(
      { _id: { $in: userIdsToUntag } },
      { $pull: { taggedCollages: collageId } }
    );

    return {
      success: true,
      message: "Users untagged successfully",
      collageId: collageId,
      taggedUsers: updatedCollage.tagged,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while untagging users.");
  }
};

export default untagUsers;
