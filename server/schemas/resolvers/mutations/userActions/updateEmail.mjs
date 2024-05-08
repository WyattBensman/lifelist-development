import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const updateEmail = async (_, { email }, { user }) => {
  try {
    isUser(user);

    // Update the user's email address
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { email },
      { new: true, runValidators: true }
    );

    // Successfully updated the email
    return {
      success: true,
      message: "Email successfully updated.",
      email: updatedUser.email,
    };
  } catch (error) {
    console.error(`Update Email Error: ${error.message}`);
    throw new Error("Failed to update email. Please try again.");
  }
};

export default updateEmail;
