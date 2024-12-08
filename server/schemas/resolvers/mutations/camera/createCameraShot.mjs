import { CameraShot, User } from "../../../../models/index.mjs";

const createCameraShot = async (_, { image, thumbnail }, { user }) => {
  try {
    // Find the current user
    const currentUser = await User.findById(user);

    if (!currentUser) throw new Error("User not found.");

    // Check if the user has shots left
    /* if (currentUser.shotsLeft <= 0) {
      throw new Error("You have no shots left for today.");
    } */

    // Generate a random developing time between 4 to 16 minutes
    const developingTime = Math.floor(Math.random() * (16 - 4 + 1)) + 4;

    // Calculate when the shot will be ready for review
    const readyToReviewAt = new Date(Date.now() + developingTime * 60 * 1000);

    // Create the new CameraShot
    const newShot = new CameraShot({
      author: user,
      image, // Full-size image URL passed from the client
      imageThumbnail: thumbnail, // Thumbnail URL passed from the client
      developingTime,
      readyToReviewAt,
      isDeveloped: false, // Initial state
      transferredToRoll: false, // Initial state
    });

    await newShot.save();

    // Add the shot to the user's developing shots
    currentUser.developingCameraShots.push(newShot._id);

    // Decrement the user's shotsLeft count by 1
    /* currentUser.shotsLeft -= 1; */
    await currentUser.save();

    return {
      success: true,
      message: "Added to developing shots.",
      cameraShot: {
        _id: newShot._id,
        imageThumbnail: newShot.imageThumbnail,
        developingTime: newShot.developingTime,
        isDeveloped: newShot.isDeveloped,
        readyToReviewAt: newShot.readyToReviewAt,
        transferredToRoll: newShot.transferredToRoll,
      },
    };
  } catch (error) {
    console.error("Error creating camera shot:", error.message, error.stack);
    throw new Error("Failed to create camera shot.");
  }
};

export default createCameraShot;
