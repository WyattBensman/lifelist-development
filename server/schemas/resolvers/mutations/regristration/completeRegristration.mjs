export const completeRegristration = async (
  _,
  { userId, firstName, lastName, username, password }
) => {
  // Input validation
  if (!firstName || !lastName) {
    throw new Error("Both first name and last name are required.");
  }

  if (!username) {
    throw new Error("Setting a password is required.");
  }

  if (!password) {
    throw new Error("Setting a password is required.");
  }

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });

    if (existingUser) {
      throw new Error(
        "Username is already taken. Please choose a different one."
      );
    }

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        username,
        password,
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
