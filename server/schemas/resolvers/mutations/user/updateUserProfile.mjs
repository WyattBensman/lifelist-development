export const updateUserProfile = async (
  _,
  { profilePicture, fName, lName, username, bio },
  { user }
) => {
  if (!user) {
    throw new AuthenticationError();
  }

  // Validate fName and lName
  if (!fName || !lName) {
    throw new Error("Both first name and last name are required.");
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        profilePicture,
        fName,
        lName,
        username,
        bio,
      },
      { new: true, runValidators: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
