import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const setBasicInformation = async (_, { fullName, gender }, { user }) => {
  isUser(user);

  // Input validation
  if (!fullName) {
    throw new Error("Full name is required.");
  }
  if (!gender) {
    throw new Error("Gender is required.");
  }

  try {
    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { fullName, gender },
      { new: true, runValidators: true } // Ensure updated document is returned and validators run
    );

    if (!updatedUser) {
      throw new Error("User not found.");
    }

    return {
      success: true,
      message: "Basic information successfully updated.",
      user: updatedUser,
    };
  } catch (error) {
    console.error(`Error updating basic information: ${error.message}`);
    throw new Error(
      "An error occurred during the update of basic information."
    );
  }
};

export default setBasicInformation;
