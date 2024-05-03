import User from "../models/user/user.mjs";

export const cleanupExpiredRegistrations = async () => {
  const expiredUsers = await User.find({
    status: "pending",
    expiryDate: { $lte: new Date() },
  });

  // Use bulkWrite for efficiency when deleting multiple documents
  const userIds = expiredUsers.map((user) => user._id);

  if (userIds.length > 0) {
    await User.deleteMany({
      _id: { $in: userIds },
    });
    console.log(`Deleted ${userIds.length} expired user registrations.`);
  } else {
    console.log("No expired registrations found to delete.");
  }
};
