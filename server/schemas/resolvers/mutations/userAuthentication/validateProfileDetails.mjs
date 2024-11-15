import { validateFullName } from "../../../../utils/validation.mjs";

export const validateProfileDetails = ({ fullName, gender }) => {
  validateFullName(fullName);

  const allowedGenders = ["MALE", "FEMALE", "PREFER NOT TO SAY"];
  if (!allowedGenders.includes(gender)) {
    throw new Error("Invalid gender. Please select a valid option.");
  }

  return {
    success: true,
    message: "Full name and gender validated successfully.",
  };
};
