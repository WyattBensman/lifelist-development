export const verifyUser = async (_, { userId, verificationCode }) => {
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

    return {
      message: "Contact information verified. Complete your profile.",
      user,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during user creation.");
  }
};

// Step 2: Verification
router.post("/verify", async (req, res) => {
  try {
    const { userId, verificationCode } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the verification code matches
    if (
      verificationCode !== user.emailVerification.code &&
      verificationCode !== user.phoneVerification.code
    ) {
      return res.status(400).json({ error: "Invalid verification code." });
    }

    // Mark the email and/or phone as verified
    if (verificationCode === user.emailVerification.code) {
      user.emailVerification.verified = true;
    }

    if (verificationCode === user.phoneVerification.code) {
      user.phoneVerification.verified = true;
    }

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: "Contact information verified. Complete your profile.",
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res
      .status(500)
      .json({ error: "An error occurred during verification." });
  }
});
