import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { uploadMultipleImages } from "../../../../utils/uploadImages.mjs";
import createNotification from "../notifications/createNotification.mjs";

const createCollage = async (_, { caption, images, taggedUsers }, { user }) => {
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

    // Upload the images and get their URLs
    const uploadDir = "./uploads";
    const imageUrls = await uploadMultipleImages(images, uploadDir);

    // Create a new collage document
    const collage = new Collage({
      author: user,
      caption,
      images: imageUrls,
      tagged: taggedUsers.map((user) => user),
      posted: true,
    });

    await collage.save();

    // Send notifications to tagged users
    const taggedUserIds = taggedUsers.map((taggedUser) => taggedUser._id);

    // Add the collage to the taggedCollages field for each tagged user
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
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred while posting the collage.");
  }
};

export default createCollage;
