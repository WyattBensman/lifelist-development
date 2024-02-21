import { Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { uploadMultipleImages } from "../../../../utils/uploadImages.mjs";

const startCollageCreation = async (_, { images }, { user }) => {
  try {
    isUser(user);

    // Validate that at least one image is provided
    if (!images || images.length === 0) {
      throw new Error("At least one image is required.");
    }

    // Validate the number of images (up to 14 allowed)
    if (images.length > 14) {
      throw new Error("Up to 14 images are allowed per collage.");
    }

    // Upload multiple images and get their paths
    const imagePaths = await uploadMultipleImages(images, "your-upload-dir");

    const newCollage = await Collage.create({
      author: user.id,
      images: imagePaths,
    });

    return newCollage;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during collage creation start.");
  }
};

export default startCollageCreation;
