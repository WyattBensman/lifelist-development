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

    // Validate inputs
    if (!images || images.length === 0) {
      throw new Error("At least one image is required to create a collage.");
    }
    if (images.length > 12) {
      throw new Error("A collage can have at most 12 images.");
    }
    const selectedCoverImage = coverImage || images[0];

    // Create a new collage
    const collage = await Collage.create({
      author: user,
      caption,
      images,
      coverImage: selectedCoverImage,
      tagged: taggedUsers.map((u) => u),
      posted: true,
    });

    // Update user collages
    await User.findByIdAndUpdate(user, {
      $addToSet: { collages: collage._id },
    });

    // Notify tagged users
    const taggedUserIds = taggedUsers.map((taggedUser) => taggedUser._id);
    await User.updateMany(
      { _id: { $in: taggedUserIds } },
      { $addToSet: { taggedCollages: collage._id } }
    );

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
      collage: {
        _id: collage._id,
        coverImage: collage.coverImage,
        createdAt: collage.createdAt,
      },
    };
  } catch (error) {
    throw new Error("An error occurred while creating the collage.");
  }
};

export default createCollage;
