import { CameraShot, User } from "../models/index.mjs";

// Job to check and transfer shots after 24 hours if not manually transferred
const transferShotsAfter24Hours = async () => {
  try {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Find all shots that are ready for review but not yet transferred and were marked ready more than 24 hours ago
    const shotsToTransfer = await CameraShot.find({
      isDeveloped: true,
      transferredToRoll: false,
      readyToReviewAt: { $lte: cutoffDate },
    });

    // Transfer each shot to the user's main camera shots field
    for (const shot of shotsToTransfer) {
      const user = await User.findById(shot.author);

      // Add the shot to the user's camera shots field and remove from developing shots
      if (user) {
        user.cameraShots.push(shot._id);
        user.developingCameraShots = user.developingCameraShots.filter(
          (id) => !id.equals(shot._id)
        );
        await user.save();
      }

      // Mark the shot as transferred
      shot.transferredToRoll = true;
      await shot.save();
    }

    console.log(
      `Transferred ${shotsToTransfer.length} shots to the camera roll after 24 hours.`
    );
  } catch (error) {
    console.error("Error transferring shots after 24 hours:", error.message);
  }
};

// Set the job to run at regular intervals (every 3 hours)
setInterval(transferShotsAfter24Hours, 3 * 60 * 60 * 1000); // Run every 3 hours
