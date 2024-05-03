import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import { uploadMultipleImages } from "../../../../utils/uploadImages.mjs";

const startCollage = async (_, { images }, { user }) => {
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
    const newCollage = await Collage.create({
      author: user._id,
      images: imageUrls,
    });

    // Update the user's collages array with the new collage ID
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { collages: newCollage._id } },
      { new: true }
    );

    // Return success message along with the collage ID
    return {
      success: true,
      message: "Collage created successfully.",
      collageId: newCollage._id,
    };
  } catch (error) {
    console.error(`Error creating collage: ${error.message}`);
    throw new Error("Failed to create collage.");
  }
};

export default startCollage;
