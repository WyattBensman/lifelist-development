import { applyCameraEffects } from "../../../../utils/applyCameraEffects.mjs";
import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";
import { CameraShot, User } from "../../../../models/index.mjs";

const createCameraShot = async (
  _,
  { authorId, image, camera, shotOrientation, dimensions },
  { user }
) => {
  try {
    // Ensure the uploads directory exists
    const uploadDir = "./uploads";

    // Save the uploaded image file
    const filePath = await uploadSingleImage(image, uploadDir);

    // Apply camera effects
    await applyCameraEffects(filePath, camera);

    // Create the new CameraShot
    const newShot = new CameraShot({
      author: authorId,
      image: filePath,
      camera,
      shotOrientation,
      dimensions: dimensions,
    });
    await newShot.save();

    // Update the User model to include the new camera shot in their cameraShots field
    await User.findByIdAndUpdate(authorId, {
      $addToSet: { cameraShots: newShot._id },
    });

    return newShot;
  } catch (error) {
    console.error("Error creating camera shot:", error);
    throw new Error("Failed to create camera shot.");
  }
};

export default createCameraShot;
