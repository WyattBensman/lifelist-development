import { isCurrentUser } from "../../../../utils/auth.mjs";
import { User } from "../../../../models/index.mjs";

const updateUserSettings = async (
  _,
  { privacy, darkMode, language, notifications },
  { user }
) => {
  try {
    // Authenticate
    isUser(user);

    // Update the user's settings
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        settings: {
          privacy,
          darkMode,
          language,
          notifications,
        },
      },
      { new: true, runValidators: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during user settings update.");
  }
};

export default updateUserSettings;
