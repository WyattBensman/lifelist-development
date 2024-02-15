export const completeRegristration = async (
  _,
  { userId, fName, lName, password, gender }
) => {
  if (!fName || !lName) {
    throw new Error("Both first name and last name are required.");
  }

  if (!password) {
    throw new Error("Setting a password is required.");
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        fName,
        lName,
        password,
        gender,
      },
      { new: true, runValidators: true }
    );

    // Generate JWT token
    const token = generateToken(user);

    return { token, user };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during regristration.");
  }
};
