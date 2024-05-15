import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const updateSettings = async (
  _,
  { isProfilePrivate, darkMode, language, notifications, postRepostToMainFeed },
  { user }
) => {
  try {
    isUser(user);

    // Update the user's settings
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        settings: {
          isProfilePrivate,
          darkMode,
          language,
          notifications,
          postRepostToMainFeed,
        },
      },
      { new: true, runValidators: true }
    );

    return {
      isProfilePrivate: updatedUser.settings.isProfilePrivate,
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
