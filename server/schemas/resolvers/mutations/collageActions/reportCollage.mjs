import { isUser, findCollageById } from "../../../../utils/auth.mjs";

const reportCollage = async (_, { collageId, reason }, { user }) => {
  try {
    isUser(user);

    // Verify the collage exists
    const collage = await findCollageById(collageId);

    // Check if the reporter has already reported the collage
    const alreadyReported = collage.reports.some(
      (report) => report.reporter.toString() === user.toString()
    );
    if (alreadyReported) {
      throw new Error("You have already reported this collage.");
    }

    // Add the report to the collage
    collage.reports.push({ reporter: user, reason });
    await collage.save();

    return {
      success: true,
      message: "Collage successfully reported.",
      action: "REPORT_COLLAGE",
    };
  } catch (error) {
    console.error(`Report Collage Error: ${error.message}`);
    throw new Error("An error occurred during collage reporting.");
  }
};

export default reportCollage;
