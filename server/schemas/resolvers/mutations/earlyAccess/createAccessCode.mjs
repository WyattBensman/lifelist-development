import { AccessCode } from "../../../../models/index.mjs";

const createAccessCode = async (_, { code, endDate, isActive = true }) => {
  try {
    // Check if the code already exists
    const existingCode = await AccessCode.findOne({ code });
    if (existingCode) {
      throw new Error("An access code with this value already exists.");
    }

    // Create a new access code
    const newAccessCode = new AccessCode({
      code,
      endDate: new Date(endDate),
      isActive,
      count: 0, // Initialize usage count to 0
      users: [], // Initialize empty users array
    });

    // Save the access code to the database
    await newAccessCode.save();

    return {
      success: true,
      message: "Access code created successfully.",
      accessCode: newAccessCode,
    };
  } catch (error) {
    console.error(`Error creating access code: ${error.message}`);
    throw new Error("Failed to create access code.");
  }
};

export default createAccessCode;
