import { isUser } from "../../../../utils/auth.mjs";
import { User } from "../../../../models/index.mjs";

export const reportProfile = async (_, { profileId, reason }, { user }) => {
  try {
    isUser(user);

    // Verify the user profile exists
    const profile = await User.findById(profileId);
    if (!profile) {
      throw new Error("Profile not found.");
    }

    // Check if the reporter has already reported the profile
    const alreadyReported = profile.reports.some(
      (report) => report.reporter.toString() === user.toString()
    );
    if (alreadyReported) {
      throw new Error("You have already reported this profile.");
    }

    // Add the report to the profile
    profile.reports.push({ reporter: user, reason });
    await profile.save();

    return {
      success: true,
      message: "Profile successfully reported.",
    };
  } catch (error) {
    console.error(`Report Profile Error: ${error.message}`);
    throw new Error("An error occurred during profile reporting.");
  }
};
