import { Collage, User } from "../../../../models/index.mjs";
import { isUser, isCurrentAuthor } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const postCollage = async (_, { collageId }, { user }) => {
  try {
    isUser(user);
    await isCurrentAuthor(user, collageId);

    const currentUser = User.findById(user_.id);

    // Update the collage's post status and createdAt
    const updatedCollage = await Collage.findByIdAndUpdate(
      collageId,
      { $set: { posted: true, createdAt: new Date() } },
      { new: true, runValidators: true }
    )
      .populate({
        path: "author",
        select: "_id username fullName profilePicture",
      })
      .populate({
        path: "privacyGroup",
        populate: { path: "users", select: "_id username fullName" },
      });

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
        message: `${currentUser.fullName} tagged you in a collage.`,
      });
    }

    return updatedCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while posting the collage.");
  }
};

export default postCollage;
