import { AccessCode } from "../../../../models/index.mjs";

const verifyAccessCode = async (_, { code }) => {
  try {
    // Find the access code
    const accessCode = await AccessCode.findOne({ code });

    if (!accessCode) {
      throw new Error("Access code not found.");
    }

    if (!accessCode.isActive || new Date() > accessCode.endDate) {
      throw new Error("Access code is inactive or expired.");
    }

    // Increment the count field
    accessCode.count += 1;
    await accessCode.save();

    return {
      success: true,
      message: "Access code verified successfully.",
    };
  } catch (error) {
    console.error(`Error verifying access code: ${error.message}`);
    throw new Error("Failed to verify access code.");
  }
};

export default verifyAccessCode;
