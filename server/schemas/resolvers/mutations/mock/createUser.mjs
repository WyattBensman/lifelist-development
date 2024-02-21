import { User } from "../../../../models/index.mjs";

const createUser = async (
  _,
  { fName, lName, email, phoneNumber, password, username, gender, birthday }
) => {
  try {
    if (!email && !phoneNumber) {
      throw new Error(
        "Provide either an email or phone number for registration."
      );
    }
    if (!birthday) {
      throw new Error("Birthday is required for registration.");
    }

    // Check if the email or username is already taken
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error("Email or username already exists.");
    }

    // Create User
    const newUser = await User.create(
      {
        fName,
        lName,
        email,
        phoneNumber,
        password,
        username,
        gender,
        birthday,
        verified: true,
      },
      { runValidators: true }
    );

    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

export default createUser;
