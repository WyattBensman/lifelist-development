import { User } from "../../../../models/index.mjs";
import { generateToken } from "../../../../utils/auth.mjs";

const initializeRegistration = async (_, { email, phoneNumber, birthday }) => {
  try {
    // Ensure either email or phone number is provided
    if (!email && !phoneNumber) {
      throw new Error(
        "Provide either an email or phone number for registration."
      );
    }

    // Ensure birthday is provided
    if (!birthday) {
      throw new Error("Birthday is required for registration.");
    }

    let existingUser = null; // Declare outside to ensure scope visibility

    // Check if phoneNumber is provided and non-null
    if (phoneNumber) {
      existingUser = await User.findOne({ phoneNumber: phoneNumber });
    }

    // Check if email is provided and non-null, and no existing user was found from phoneNumber
    if (!existingUser && email) {
      existingUser = await User.findOne({ email: email.toLowerCase() }); // Also ensure email is processed in lowercase for consistency
    }

    // If an existing user is found with either email or phoneNumber, throw an error
    if (existingUser) {
      throw new Error(
        "An account with this email or phone number already exists."
      );
    }

    // Calculate age to ensure the user is at least 18 years old
    const currentDate = new Date();
    const userBirthday = new Date(birthday);
    let age = currentDate.getFullYear() - userBirthday.getFullYear();
    const m = currentDate.getMonth() - userBirthday.getMonth();

    if (m < 0 || (m === 0 && currentDate.getDate() < userBirthday.getDate())) {
      age--;
    }

    if (age < 18) {
      throw new Error("You must be at least 18 years old to register.");
    }

    // Create the user in the database
    const newUser = await User.create({
      email,
      phoneNumber,
      birthday,
      status: "pending", // Set status to 'pending'
      expiryDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // Set expiry date to 48 hours from now
      verified: false,
    });

    // Generate JWT token
    const token = generateToken(newUser._id);

    return {
      success: true,
      message: "Registration successful.",
      token: token,
      user: newUser,
    };
  } catch (error) {
    console.error(`Registration Error: ${error.message}`);
    return {
      success: false,
      message: "Registration failed: " + error.message,
      token: null,
      user: null,
    };
  }
};

export default initializeRegistration;
