import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const createCollage = async (
  _,
  { caption, images, taggedUsers, coverImage },
  { user }
) => {
  try {
    isUser(user);

    // Validate that at least one image is provided
    if (!images || images.length === 0) {
      throw new Error("At least one image is required to create a collage.");
    }

    // Validate the number of images (1 to 12 allowed)
    if (images.length > 12) {
      throw new Error("A collage can have at most 12 images.");
    }

    // Set the coverImage, defaulting to the first image if not provided
    const selectedCoverImage = coverImage || images[0];
    if (!selectedCoverImage) {
      throw new Error("A valid cover image must be provided.");
    }

    // Create a new collage document
    const collage = new Collage({
      author: user,
      caption,
      images,
      coverImage: selectedCoverImage,
      tagged: taggedUsers.map((user) => user),
      posted: true,
    });

    await collage.save();

    // Add the collage to the current user's collages
    await User.findByIdAndUpdate(user, {
      $addToSet: { collages: collage._id },
    });

    // Add the collage to the taggedCollages field for each tagged user
    const taggedUserIds = taggedUsers.map((taggedUser) => taggedUser._id);
    await User.updateMany(
      { _id: { $in: taggedUserIds } },
      { $addToSet: { taggedCollages: collage._id } }
    );

    // Send notifications to tagged users
    for (const taggedUserId of taggedUserIds) {
      await createNotification({
        recipientId: taggedUserId,
        senderId: user,
        type: "TAG",
        message: `${user.fullName} tagged you in a collage.`,
      });
    }

    return {
      success: true,
      message: "Collage successfully created.",
    };
  } catch (error) {
    throw new Error("An error occurred while posting the collage.");
  }
};

export default createCollage;
