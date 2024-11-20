import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const updateCollage = async (
  _,
  { collageId, caption, images, taggedUsers, coverImage },
  { user }
) => {
  try {
    isUser(user);

    // Validate that the collage exists and belongs to the current user
    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Validate that at least one image is provided
    if (!images || images.length === 0) {
      throw new Error("At least one image is required to update a collage.");
    }

    // Validate the number of images (1 to 12 allowed)
    if (images.length > 12) {
      throw new Error("A collage can have at most 12 images.");
    }

    // Determine the coverImage, defaulting to the first image if not provided
    const selectedCoverImage = coverImage || images[0];
    if (!selectedCoverImage) {
      throw new Error("A valid cover image must be provided.");
    }

    // Update the collage fields
    collage.caption = caption || collage.caption;
    collage.images = images;
    collage.coverImage = selectedCoverImage;

    // Handle tagged users
    const currentTaggedUserIds = collage.tagged.map((user) =>
      user._id.toString()
    );
    const updatedTaggedUserIds = taggedUsers.map((user) => user._id.toString());

    // Add the collage to newly tagged users' taggedCollages
    const newlyTaggedUsers = updatedTaggedUserIds.filter(
      (_id) => !currentTaggedUserIds.includes(_id)
    );
    await User.updateMany(
      { _id: { $in: newlyTaggedUsers } },
      { $addToSet: { taggedCollages: collage._id } }
    );

    // Remove the collage from untagged users' taggedCollages
    const untaggedUsers = currentTaggedUserIds.filter(
      (id) => !updatedTaggedUserIds.includes(id)
    );
    await User.updateMany(
      { _id: { $in: untaggedUsers } },
      { $pull: { taggedCollages: collage._id } }
    );

    // Update the tagged users on the collage
    collage.tagged = updatedTaggedUserIds;

    // Save the collage
    await collage.save();

    // Send notifications to newly tagged users
    for (const taggedUserId of newlyTaggedUsers) {
      await createNotification({
        recipientId: taggedUserId,
        senderId: user,
        type: "TAG",
        message: `${user.fullName} tagged you in a collage.`,
      });
    }

    return {
      success: true,
      message: "Collage successfully updated.",
    };
  } catch (error) {
    throw new Error(
      `An error occurred while updating the collage: ${error.message}`
    );
  }
};

export default updateCollage;
