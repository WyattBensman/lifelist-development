import { AccessCode, User } from "../../../../models/index.mjs";

const associateUserWithAccessCode = async (_, { userId, code }) => {
  try {
    // Find the access code
    const accessCode = await AccessCode.findOne({ code });
    if (!accessCode) {
      throw new Error("Access code not found.");
    }

    if (!accessCode.isActive || new Date() > accessCode.endDate) {
      throw new Error("Access code is inactive or expired.");
    }

    // Check if the user is already associated with the code
    const isUserAssociated = accessCode.users.some(
      (user) => user.userId.toString() === userId.toString()
    );

    if (isUserAssociated) {
      throw new Error("User is already associated with this access code.");
    }

    // Add the user to the `users` field
    accessCode.users.push({ userId, usedAt: new Date() });
    await accessCode.save();

    // Update the user's profile with the access code
    await User.findByIdAndUpdate(userId, { accessCode: accessCode._id });

    return {
      success: true,
      message: "Access code associated with user successfully.",
    };
  } catch (error) {
    console.error(`Error associating user with access code: ${error.message}`);
    throw new Error("Failed to associate user with access code.");
  }
};

export default associateUserWithAccessCode;
