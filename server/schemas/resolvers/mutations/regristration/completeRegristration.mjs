// Step 3: Complete Profile
router.post("/complete-profile", async (req, res) => {
  try {
    const { userId, fName, lName, password, gender } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Set additional profile information
    user.fName = fName;
    user.lName = lName;
    user.password = password; // You may want to hash the password here
    user.gender = gender;

    // Save the completed profile
    await user.save();

    return res.status(200).json({ message: "Profile completed successfully." });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res
      .status(500)
      .json({ error: "An error occurred while completing the profile." });
  }
});

// Function to generate verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default router;
