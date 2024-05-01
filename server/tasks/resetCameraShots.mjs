import cron from "node-cron";
import { User } from "../models/index.mjs";

const resetCameraShots = cron.schedule(
  "0 6 * * *",
  async function () {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set to the start of today

    // Find users whose lastReset is before the start of today
    const users = await User.find({
      "dailyCameraShots.lastReset": { $lt: startOfToday },
    });

    for (let user of users) {
      user.cameraShots.push(...user.developingCameraShots);
      user.developingCameraShots = [];
      user.dailyCameraShots.count = 0;
      user.dailyCameraShots.lastReset = new Date(); // Set to the current time
      await user.save();
    }

    console.log("Camera shots reset and transferred for all applicable users.");
  },
  {
    scheduled: false, // By setting scheduled to false, the job won't start automatically
  }
);

export default resetCameraShots;
