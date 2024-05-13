import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const setLoginInformation = async (_, { username, password }, { user }) => {
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

    // Retrieve the user
    let userToUpdate = await User.findById(user._id);
    if (!userToUpdate) {
      throw new Error("User not found.");
    }

    // Set new values
    userToUpdate.username = username;
    userToUpdate.password = password;
    userToUpdate.status = "active";
    userToUpdate.expiryDate = null;

    // Save the user
    const updatedUser = await userToUpdate.save();

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

export default setLoginInformation;
