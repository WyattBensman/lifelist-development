import { User } from "../../../../models/index.mjs";
import {
  sendVerificationCodeEmail,
  sendVerificationCodeSMS,
  generateVerificationCode,
} from "../../../../utils/verification.mjs";

export const initialRegristration = async (
  _,
  { email, phoneNumber, username, birthday }
) => {
  try {
    // Check availability for Email, Phone & Username
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { phoneNumber: phoneNumber },
        { username: username },
      ],
    });

    if (existingUser) {
      let errorMessage = "An account with ";

      if (existingUser.email === email) {
        errorMessage += "this email";
      } else if (existingUser.phoneNumber === phoneNumber) {
        errorMessage += "this phone number";
      } else if (existingUser.username === username) {
        errorMessage += "this username";
      }

      errorMessage += " is already in use.";

      throw new Error(errorMessage);
    }

    // Generate Verification Code
    const verificationCode = generateVerificationCode();

    // Create User with Verification Code & False Status
    const newUser = await User.create({
      email,
      phoneNumber,
      username,
      birthday,
      emailVerification: {
        code: verificationCode,
        verified: false,
      },
      phoneVerification: {
        code: verificationCode,
        verified: false,
      },
    });

    // Send verification code to user's email or phone
    if (email) {
      sendVerificationCodeEmail(email, verificationCode);
    } else if (phoneNumber) {
      sendVerificationCodeSMS(phoneNumber, verificationCode);
    }

    return {
      message: "Verification code sent. Verify your contact information.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during user creation.");
  }
};
