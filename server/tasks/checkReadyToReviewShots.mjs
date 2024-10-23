import { CameraShot } from "../models/index.mjs";

// Job to check if any developing shots are ready to review
const checkReadyToReviewShots = async () => {
  try {
    const now = new Date();

    // Find all shots where the readyToReviewAt time has passed and isDeveloped is still false
    const shotsReady = await CameraShot.updateMany(
      {
        readyToReviewAt: { $lte: now },
        isDeveloped: false,
      },
      {
        $set: { isDeveloped: true }, // Mark shots as developed
      }
    );

    console.log(
      `Checked and updated ${shotsReady.nModified} shots to be ready for review.`
    );
  } catch (error) {
    console.error("Error checking ready to review shots:", error.message);
  }
};

// Set the job to run at regular intervals (every 30 minutes)
setInterval(checkReadyToReviewShots, 30 * 60 * 1000); // Run every 30 minutes
