import { User } from "../../../../models/index.mjs";
import {
  sendVerificationCodeEmail,
  sendVerificationCodeSMS,
  generateVerificationCode,
} from "../../../../utils/sendVerification.mjs";

export const resendVerificationCode = async (_, { userId }) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    // Generate a new verification code
    const newVerificationCode = generateVerificationCode();

    // Update user's verification codes
    user.emailVerification.code = newVerificationCode;
    user.phoneVerification.code = newVerificationCode;

    // Save the updated user
    await user.save();

    // Resend verification code to user's email or phone
    if (user.email) {
      sendVerificationCodeEmail(user.email, newVerificationCode);
    } else if (user.phoneNumber) {
      sendVerificationCodeSMS(user.phoneNumber, newVerificationCode);
    }

    return user;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during resend verification.");
  }
};
