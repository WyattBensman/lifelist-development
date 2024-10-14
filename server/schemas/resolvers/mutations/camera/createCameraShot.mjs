import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";
import { CameraShot, User } from "../../../../models/index.mjs";
import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const createCameraShot = async (_, { image } /* { user } */) => {
  try {
    const uploadDir = path.join(__dirname, "../../../../uploads");
    const user = "663a3129e0ffbeff092b81d4";

    console.log(`Image Passed: ${image}`);
    console.log(`Create Read Stream Passed: ${image.createReadStream}`);
    console.log(`File Name Passed: ${image.filename}`);
    console.log(`Upload Dir Passed: ${uploadDir}`);

    // Save the uploaded image file
    const filePath = await uploadSingleImage(image, uploadDir);
    console.log("Image uploaded to:", filePath);

    const baseUrl = process.env.API_URL;
    const fileUrl = `${baseUrl}/uploads/${path.basename(filePath)}`;

    // Create the new CameraShot
    const newShot = new CameraShot({
      author: user,
      image: fileUrl,
      capturedAt: new Date(),
    });

    await newShot.save();

    await User.findByIdAndUpdate(user, {
      $addToSet: { developingCameraShots: newShot._id },
    });

    return {
      success: true,
      message: "Added to developing shots.",
    };
  } catch (error) {
    console.error("Error creating camera shot:", error.message, error.stack);
    throw new Error("Failed to create camera shot.");
  }
};

export default createCameraShot;
