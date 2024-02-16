import { User } from "../../../../models/index.mjs";
import { isCurrentUser } from "../../../../utils/auth.mjs";

export const updateUserContact = async (
  _,
  { userId, email, phoneNumber, gender },
  { user }
) => {
  try {
    // Check if the user is authenticated & is the current user
    isCurrentUser(user, userId);

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
      userId,
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
