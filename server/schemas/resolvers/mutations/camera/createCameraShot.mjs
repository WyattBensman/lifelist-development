import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";
import { CameraShot, User } from "../../../../models/index.mjs";
import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const createCameraShot = async (_, { image } /* { user } */) => {
  try {
    const user = "663a3129e0ffbeff092b81d4";
    const uploadDir = path.join(__dirname, "../../../../uploads");

    // Await the promise to resolve and extract the file information
    const { createReadStream, filename, mimetype } = await image.promise;

    console.log("Create Read Stream Passed:", createReadStream);
    console.log("File Name Passed:", filename);
    console.log("MIME Type Passed:", mimetype);

    // Save the uploaded image file
    const filePath = await uploadSingleImage(
      { createReadStream, filename },
      uploadDir
    );
    console.log("Image uploaded to:", filePath);

    // Store relative path in the database
    const fileUrl = `/uploads/${path.basename(filePath)}`;

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
