export const verification = async (_, { userId, verificationCode }) => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    // Determine if the verification code matches email or phone
    const isEmailVerification =
      verificationCode === user.emailVerification.code;
    const isPhoneVerification =
      verificationCode === user.phoneVerification.code;

    if (!isEmailVerification && !isPhoneVerification) {
      throw new Error("Invalid verification code.");
    }

    // Mark the email and/or phone as verified
    if (isEmailVerification) {
      user.emailVerification.verified = true;
    }

    if (isPhoneVerification) {
      user.phoneVerification.verified = true;
    }

    // Set the user as verified if either an email and phone is verified
    if (user.emailVerification.verified || user.phoneVerification.verified) {
      user.verified = true;
    }

    // Save the updated user
    await user.save();

    return user;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred during verification.");
  }
};
