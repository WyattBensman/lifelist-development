import { User } from "../../../../models/index.mjs";
import {
  sendVerificationCodeEmail,
  sendVerificationCodeSMS,
  generateVerificationCode,
} from "../../../../utils/verification.mjs";

export const initializeRegristration = async (
  _,
  { email, phoneNumber, birthday }
) => {
  try {
    // Check for valid input
    if (!email && !phoneNumber) {
      throw new Error(
        "Provide either an email or phone number for registration."
      );
    }
    if (!birthday) {
      throw new Error("Birthday is required for registration.");
    }

    // Check availability for Email or Phone
    const existingUser = await User.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });

    if (existingUser) {
      let errorMessage = "An account with ";

      if (existingUser.email === email) {
        errorMessage += "this email";
      } else if (existingUser.phoneNumber === phoneNumber) {
        errorMessage += "this phone number";
      }

      errorMessage += " is already in use.";

      throw new Error(errorMessage);
    }

    // Check if the user is 18 years or older
    const currentDate = new Date();
    const userBirthday = new Date(birthday);
    const age = currentDate.getFullYear() - userBirthday.getFullYear();

    if (age < 18) {
      throw new Error("You must be at least 18 years old to register.");
    }

    // Generate Verification Code
    const verificationCode = generateVerificationCode();

    // Create User with Verification Code & False Status
    const newUser = await User.create(
      {
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
      },
      { runValidators: true }
    );

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
