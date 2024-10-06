import { User } from "../../../../models/index.mjs";
import { AuthenticationError, generateToken } from "../../../../utils/auth.mjs";

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

    // Validate user
    if (!user) {
      throw new AuthenticationError("User does not exist.");
    }

    // Validate password
    const passwordIsValid = await user.isCorrectPassword(password);
    if (!passwordIsValid) {
      throw new AuthenticationError("Invalid password.");
    }

    // Generate and return JWT token
    const token = generateToken(user._id);
    return { token };
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    throw new AuthenticationError(
      "An error occurred during login. Please try again."
    );
  }
};

export default login;
