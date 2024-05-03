import { User } from "../../../../models/index.mjs";
import { isUser, AuthenticationError } from "../../../../utils/auth.mjs";

const updatePhoneNumber = async (_, { phoneNumber }, { user }) => {
  try {
    // Check if the request is from an authenticated user
    isUser(user);

    // Update the user's phone number
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { phoneNumber },
      { new: true, runValidators: true }
    );

    // Successfully updated the phone number
    return {
      success: true,
      message: "Phone number successfully updated.",
      phoneNumber: updatedUser.phoneNumber,
    };
  } catch (error) {
    console.error(`Update Phone Number Error: ${error.message}`);
    throw new Error("Failed to update phone number. Please try again.");
  }
};

export default updatePhoneNumber;
