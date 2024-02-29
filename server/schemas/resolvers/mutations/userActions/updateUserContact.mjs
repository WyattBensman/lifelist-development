import { User } from "../../../../models/index.mjs";
import { isCurrentUser } from "../../../../utils/auth.mjs";

const updateUserContact = async (
  _,
  { email, phoneNumber, gender },
  { user }
) => {
  try {
    // Authenticate
    isUser(user);

    // Check if the verified email is being modified
    if (user.emailVerified && email !== user.email) {
      throw new Error("Verified email cannot be modified");
    }

    // Check if the verified phoneNumber is being modified
    if (user.phoneNumberVerified && phoneNumber !== user.phoneNumber) {
      throw new Error("Verified phone number cannot be modified");
    }

    // Update the user's contact information only if new values are provided
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        email,
        phoneNumber,
        gender,
      },
      { new: true, runValidators: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during contact information update");
  }
};

export default updateUserContact;
