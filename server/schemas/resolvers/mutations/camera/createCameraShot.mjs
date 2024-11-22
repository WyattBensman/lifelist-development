import { uploadCameraImageToS3 } from "../../../../utils/awsHelper.mjs";
import { CameraShot, User } from "../../../../models/index.mjs";

const createCameraShot = async (_, { image }, { user }) => {
  try {
    // Find the current user
    const currentUser = await User.findById(user);

    // Check if the user has shots left
    if (currentUser.shotsLeft <= 0) {
      throw new Error("You have no shots left for today.");
    }

    // Extract the file stream and filename
    const { createReadStream, filename } = await image.promise;

    // Read the stream into a buffer once
    const streamBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      const stream = createReadStream();
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });

    // Process and upload the normal-sized image to S3
    const normalImageUrl = await uploadCameraImageToS3(
      { createReadStream: () => streamBuffer, filename },
      "camera-images"
    );

    // Process and upload the thumbnail image to S3 with resizing
    const thumbnailUrl = await uploadCameraImageToS3(
      { createReadStream: () => streamBuffer, filename },
      "camera-images/thumbnails",
      { width: 200, height: 300 } // Resize for thumbnails
    );

    // Generate a random developing time between 4 to 16 minutes
    const developingTime = Math.floor(Math.random() * (16 - 4 + 1)) + 4;

    // Create the new CameraShot with developingTime
    const newShot = new CameraShot({
      author: user,
      image: normalImageUrl, // Save the normal-sized image URL
      imageThumbnail: thumbnailUrl, // Save the thumbnail URL
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
      imageUrl: normalImageUrl,
      thumbnailUrl: thumbnailUrl,
      developingTime,
    };
  } catch (error) {
    console.error("Error creating camera shot:", error.message, error.stack);
    throw new Error("Failed to create camera shot.");
  }
};

export default createCameraShot;
