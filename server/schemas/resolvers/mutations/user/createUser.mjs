import { User } from "../../../../models/index.mjs";

export const createUser = async (
  _,
  { fName, lName, email, phoneNumber, password, username, birthday, gender }
) => {
  try {
    // Check if the email, phone, or username is already in use
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { phoneNumber: phoneNumber },
        { username: username },
      ],
    });

    if (existingUser) {
      throw new Error("Email, phone, or username already in use.");
    }

    const newUser = new User.create({
      fName,
      lName,
      email,
      phoneNumber,
      password,
      username,
      birthday,
      gender,
      emailVerification: {
        code: generateVerificationCode(),
        verified: false,
      },
      phoneVerification: {
        code: generateVerificationCode(),
        verified: false,
      },
    });

    // Send verification code to the user's email or phone
    if (email) {
      sendVerificationCode(email, newUser.emailVerification.code);
    } else if (phoneNumber) {
      sendVerificationCode(phoneNumber, newUser.phoneVerification.code);
    }

    const token = signToken(user);

    return { token, newUser };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during user creation.");
  }
};
