import { User } from "../../../../models/index.mjs";

const setUsernameAndPassword = async (_, { userId, username, password }) => {
  isUser(user);

  // Input validation
  if (!username) {
    throw new Error("Username is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
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
        username,
        password,
        status: "active",
        expiryDate: null,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error("User not found.");
    }

    return {
      success: true,
      message: "Username and password successfully updated.",
      user: updatedUser,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during registration.");
  }
};

export default setUsernameAndPassword;
