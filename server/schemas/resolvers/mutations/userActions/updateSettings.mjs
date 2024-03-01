import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const updateSettings = async (
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

    return {
      privacy: updatedUser.settings.privacy,
      darkMode: updatedUser.settings.darkMode,
      language: updatedUser.settings.language,
      notifications: updatedUser.settings.notifications,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during user settings update.");
  }
};

export default updateSettings;
