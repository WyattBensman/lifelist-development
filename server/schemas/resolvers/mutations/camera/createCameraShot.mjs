import { uploadSingleImage } from "../../../../utils/uploadImages.mjs";
import { CameraShot, User } from "../../../../models/index.mjs";
import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const createCameraShot = async (_, { image, thumbnail }, { user }) => {
  try {
    const uploadDir = path.join(__dirname, "../../../../uploads");

    // Find the current user
    const currentUser = await User.findById(user);

    // Check if the user has shots left
    if (currentUser.shotsLeft <= 0) {
      throw new Error("You have no shots left for today.");
    }

    // Process and save the original image
    const { createReadStream: imageStream, filename: imageFilename } =
      await image.promise;
    const originalFilePath = await uploadSingleImage(
      { createReadStream: imageStream, filename: imageFilename },
      uploadDir
    );
    const originalFileUrl = `/uploads/${path.basename(originalFilePath)}`;

    // Process and save the thumbnail image
    const { createReadStream: thumbnailStream, filename: thumbnailFilename } =
      await thumbnail.promise;
    const thumbnailFilePath = await uploadSingleImage(
      { createReadStream: thumbnailStream, filename: thumbnailFilename },
      uploadDir
    );
    const thumbnailFileUrl = `/uploads/${path.basename(thumbnailFilePath)}`;

    // Generate a random developing time between 4 to 16 minutes
    const developingTime = Math.floor(Math.random() * (16 - 4 + 1)) + 4;

    // Create the new CameraShot with developingTime
    const newShot = new CameraShot({
      author: user,
      image: originalFileUrl, // Save the original image URL
      imageThumbnail: thumbnailFileUrl, // Save the thumbnail URL
      developingTime,
    });

    await newShot.save();

    // Add the shot to the user's developing shots
    currentUser.developingCameraShots.push(newShot._id);

    // Decrement the user's shotsLeft count by 1
    currentUser.shotsLeft -= 1;
    await currentUser.save();

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
