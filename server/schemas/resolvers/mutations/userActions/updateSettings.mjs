import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const updateSettings = async (
  _,
  { privacy, darkMode, language, notifications, postRepostToMainFeed },
  { user }
) => {
  try {
    /* isUser(user); */

    // Update the user's settings
    const updatedUser = await User.findByIdAndUpdate(
      "65e72e4e82f12a087695250d",
      {
        settings: {
          privacy,
          darkMode,
          language,
          notifications,
          postRepostToMainFeed,
        },
      },
      { new: true, runValidators: true }
    );

    return {
      privacy: updatedUser.settings.privacy,
      darkMode: updatedUser.settings.darkMode,
      language: updatedUser.settings.language,
      notifications: updatedUser.settings.notifications,
      postRepostToMainFeed: updatedUser.settings.postRepostToMainFeed,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during user settings update.");
  }
};

export default updateSettings;
