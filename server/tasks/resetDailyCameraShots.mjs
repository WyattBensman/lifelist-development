import { User } from "../models/index.mjs";

export const resetDailyCameraShots = async () => {
  try {
    // Reset the shotsLeft for all users to 10
    const result = await User.updateMany({}, { $set: { shotsLeft: 10 } });

    console.log(`Reset camera shots for ${result.nModified} users to 10.`);
  } catch (error) {
    console.error("Error resetting daily camera shots:", error.message);
  }
};
