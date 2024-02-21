import { User } from "../../../../models/index.mjs";
import { AuthenticationError } from "../../../../utils/auth.mjs";
import { generateToken } from "../../../../utils/auth.mjs";

const login = async (_, { usernameOrEmailOrPhone, password }) => {
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
      throw new AuthenticationError(
        "Invalid username, email, phone number, or password"
      );
    }
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    throw new AuthenticationError("An error occurred during login");
  }
};

export default login;
