import schedule from "node-schedule";
import { User } from "../models/index.mjs";

export const autoDeletionJob = () => {
  // Logic to delete unverified users older than 24 hours
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  User.deleteMany({
    verified: false,
    createdAt: { $lt: twentyFourHoursAgo },
  })
    .then((result) => {
      console.log(`${result.deletedCount} unverified users deleted.`);
    })
    .catch((error) => {
      console.error(`Error deleting unverified users: ${error.message}`);
    });
};

// Schedule the auto-deletion job to run every day at a specific time (adjust as needed)
schedule.scheduleJob("0 0 * * *", autoDeletionJob);
