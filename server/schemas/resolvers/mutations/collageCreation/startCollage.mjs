import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { uploadMultipleImages } from "../../../../utils/uploadImages.mjs";

const startCollage = async (_, { images }, { user }) => {
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

    // Use uploadMultipleImages Util to handle file upload
    const uploadDir = "./uploads";
    const imagePaths = await uploadMultipleImages(images, uploadDir);

    const newCollage = await Collage.create({
      author: user._id,
      images: imagePaths,
    });

    // Obtain the _id of the newCollage
    const collageId = newCollage._id;

    // Update the user's collages array
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { collages: collageId } },
      { new: true }
    );

    return {
      success: true,
      message: "Images added successfully",
      collageId: collageId,
      images: newCollage.images,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during collage creation start.");
  }
};

export default startCollage;
