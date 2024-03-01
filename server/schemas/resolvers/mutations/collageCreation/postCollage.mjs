import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const postCollage = async (_, { collageId }, { user }) => {
  try {
    // Check if the user is authenticated
    isUser(user);

    // Check if the user is the author
    await isCurrentAuthor(user, collageId);

    // Check if the collage is in the user's logbook
    const isInLogbook = user.logbook.includes(collageId);

    // Remove the collage from the user's logbook if it's present
    if (isInLogbook) {
      await User.findByIdAndUpdate(
        user._id,
        { $pull: { logbook: collageId } },
        { new: true, runValidators: true }
      );
    }

    // Update the collage's post status and createdAt
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      {
        $set: {
          posted: true,
          createdAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    // Send notifications to tagged users
    const taggedUserIds = updatedCollage.tagged.map(
      (taggedUser) => taggedUser._id
    );

    // Add the collage to the taggedCollages field for each tagged user
    await User.updateMany(
      { _id: { $in: taggedUserIds } },
      { $addToSet: { taggedCollages: collageId } }
    );

    for (const taggedUserId of taggedUserIds) {
      await createNotification({
        recipientId: taggedUserId,
        senderId: user._id,
        type: "TAG",
        message: `Cody Maverick tagged you in a collage.`,
      });
    }

    return updatedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while posting the collage.");
  }
};

export default postCollage;
