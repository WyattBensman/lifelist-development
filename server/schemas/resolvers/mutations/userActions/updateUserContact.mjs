import { User } from "../../../../models/index.mjs";
import { AuthenticationError } from "../../../../utils/auth.mjs";

export const updateUserContact = async (
  _,
  { userId, email, phoneNumber, gender },
  { user }
) => {
  try {
    // Check if the user is authenticated
    if (!user) {
      throw new AuthenticationError("User not authenticated");
    }

    // Check if the currentUser is updating their own contact information
    if (user.id !== userId) {
      throw new AuthenticationError(
        "Not authorized to update this contact information"
      );
    }

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
