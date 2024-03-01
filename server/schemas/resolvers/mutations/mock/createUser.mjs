import { User } from "../../../../models/index.mjs";

const createUser = async (
  _,
  { fullName, email, phoneNumber, password, username, gender, birthday }
) => {
  try {
    // Check if the email or username is already taken
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error("Email or username already exists.");
    }

    // Create the user
    const newUser = await User.create({
      fullName,
      username,
      email,
      phoneNumber,
      password,
      gender,
      birthday: new Date(birthday),
      verified: true,
    });

    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

export default createUser;
