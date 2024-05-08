import cron from "node-cron";
import { User } from "../models/index.mjs";

export const resetCameraShots = () => {
  // Define a cron job to run daily at 6 AM
  const job = cron.schedule(
    "0 6 * * *",
    async () => {
      try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0); // Set to the start of today

        // Find users whose last camera shot reset was before today
        const users = await User.find({
          "dailyCameraShots.lastReset": { $lt: startOfToday },
        });

        // Iterate over each user to reset and transfer camera shots
        for (let user of users) {
          user.cameraShots.push(...user.developingCameraShots);
          user.developingCameraShots = []; // Clear developing shots
          user.dailyCameraShots.count = 0; // Reset daily shots count
          user.dailyCameraShots.lastReset = new Date(); // Update last reset time

          await user.save(); // Save the changes to the user document
        }

        console.log(
          "Camera shots reset and transferred for all applicable users."
        );
      } catch (error) {
        console.error("Error resetting camera shots:", error);
      }
    },
    {
      scheduled: false, // This prevents the job from auto-starting
    }
  );

  return job; // Return the job for external control if needed
};

// To start the job, you would need to call resetCameraShots().start() somewhere in your application setup
