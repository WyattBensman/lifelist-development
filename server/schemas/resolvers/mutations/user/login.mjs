import { User } from "../../../../models/index.mjs";
import { generateToken } from "../../../../utils/auth.mjs";

export const login = async (_, { usernameOrEmailOrPhone, password }) => {
  try {
    // Find user by username, email, or phone number
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmailOrPhone.toLowerCase() },
        { email: usernameOrEmailOrPhone.toLowerCase() },
        { phoneNumber: usernameOrEmailOrPhone },
      ],
    });

    // Check if user exists and password is correct
    if (user && (await user.isCorrectPassword(password))) {
      // Generate JWT token
      const token = generateToken(user);

      return { token, user };
    } else {
      throw new Error("Invalid username, email, phone number, or password");
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during login.");
  }
};
