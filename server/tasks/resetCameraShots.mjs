import cron from "node-cron";
import { User } from "../models/index.mjs";

export const resetCameraShots = () => {
  // Scheduled task to run every day at 5am
  cron.schedule("0 5 * * *", async () => {
    try {
      // Fetch all users
      const users = await User.find({});

      // Iterate through each user
      for (const user of users) {
        // Move developingCameraShots to cameraShots
        user.cameraShots.push(...user.developingCameraShots);
        // Clear developingCameraShots
        user.developingCameraShots = [];
        // Save updated user
        await user.save();
      }

      console.log(
        "Successfully moved developingCameraShots to cameraShots and cleared developingCameraShots for all users."
      );
    } catch (error) {
      console.error("Error during scheduled task:", error);
    }
  });

  console.log("Scheduled task set to run every day at 5am");
};
