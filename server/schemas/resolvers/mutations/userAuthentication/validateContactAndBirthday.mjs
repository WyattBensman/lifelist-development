import {
  isEmailAvailable,
  isPhoneNumberAvailable,
  validateBirthday,
} from "../../../../utils/validation.mjs";

export const validateContactAndBirthday = async ({
  email,
  phoneNumber,
  birthday,
}) => {
  if (!email && !phoneNumber) {
    throw new Error("Please provide either an email or a phone number.");
  }

  if (email) {
    await isEmailAvailable(email);
  }

  if (phoneNumber) {
    await isPhoneNumberAvailable(phoneNumber);
  }

  validateBirthday(birthday);

  return {
    success: true,
    message: "Contact information and birthday validated successfully.",
  };
};
