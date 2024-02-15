export const completeRegistration = async (
  _,
  { userId, fName, lName, gender }
) => {
  // Input validation
  if (!firstName || !lastName) {
    throw new Error("Both first name and last name are required.");
  }

  if (!gender) {
    throw new Error("Gender is required.");
  }

  try {
    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fName,
        lName,
        gender,
      },
      { new: true, runValidators: true }
    );

    // Generate JWT token
    const token = generateToken(updatedUser);

    return { token, user: updatedUser };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during registration.");
  }
};
