import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";
import { CameraShot, User } from "../../../../models/index.mjs";
import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const createCameraShot = async (_, { image }, { user }) => {
  try {
    // Ensure the uploads directory exists in the root
    const uploadDir = path.join(__dirname, "../../../../uploads");

    // Save the uploaded image file
    /* const filePath = await uploadSingleImage(image.file, uploadDir); */
    const filePath = await uploadSingleImage(image, uploadDir);

    // Construct the URL to access the uploaded image
    const baseUrl = process.env.API_URL;
    const fileUrl = `${baseUrl}/uploads/${path.basename(filePath)}`;

    // Create the new CameraShot
    const newShot = new CameraShot({
      author: user._id,
      image: fileUrl,
      capturedAt: new Date(),
    });
    await newShot.save();

    // Update the User model to include the new camera shot in their cameraShots field
    await User.findByIdAndUpdate(user._id, {
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
