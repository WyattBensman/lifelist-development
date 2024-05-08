import { applyCameraEffects } from "../../../../utils/applyCameraEffects.mjs";
import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";
import { CameraShot, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const createCameraShot = async (
  _,
  { image, camera, shotOrientation, dimensions },
  { user }
) => {
  try {
    isUser(user);

    // Ensure the uploads directory exists
    const uploadDir = "./uploads";

    // Save the uploaded image file
    const filePath = await uploadSingleImage(image.file, uploadDir);

    // Construct the URL to access the uploaded image
    const baseUrl = process.env.API_URL || "http://localhost:3000"; // Adjust according to your environment variable
    const fileUrl = `${baseUrl}/uploads/${filePath.split("/").pop()}`;

    // Apply camera effects
    await applyCameraEffects(filePath, camera);

    // Create the new CameraShot
    const newShot = new CameraShot({
      author: user._id,
      image: filePath,
      camera,
      shotOrientation,
      dimensions: dimensions,
    });
    await newShot.save();

    // Update the User model to include the new camera shot in their cameraShots field
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { cameraShots: newShot._id },
    });

    return newShot;
  } catch (error) {
    console.error("Error creating camera shot:", error);
    throw new Error("Failed to create camera shot.");
  }
};

export default createCameraShot;
