import { applyCameraEffects } from "../../../../utils/applyCameraEffects.mjs";
import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";
import { CameraShot, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const createCameraShot = async (
  _,
  { image, camera, shotOrientation },
  { user }
) => {
  try {
    /* isUser(user); */

    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, "../../uploads");

    console.log(`Upload Dir: ${uploadDir}`);
    console.log(`Image File: ${image.file}`);

    // Save the uploaded image file
    const filePath = await uploadSingleImage(image.file, uploadDir);

    // Construct the URL to access the uploaded image
    const baseUrl = process.env.API_URL || "http://localhost:3001"; // Adjust according to your environment variable
    const fileUrl = `${baseUrl}/uploads/${filePath.split("/").pop()}`;

    // Apply camera effects
    await applyCameraEffects(filePath, camera);

    // Create the new CameraShot
    const newShot = new CameraShot({
      author: "663a3129e0ffbeff092b81d4",
      image: fileUrl, // Use the URL to access the uploaded image
      camera,
      shotOrientation,
    });
    await newShot.save();

    // Update the User model to include the new camera shot in their cameraShots field
    await User.findByIdAndUpdate("663a3129e0ffbeff092b81d4", {
      $addToSet: { developingCameraShots: newShot._id },
    });

    return {
      success: true,
      message: "Added to developing shots.",
    };
  } catch (error) {
    console.error("Error creating camera shot:", error);
    throw new Error("Failed to create camera shot.");
  }
};

export default createCameraShot;
