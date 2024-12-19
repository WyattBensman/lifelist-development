import { isUser } from "../../../../utils/auth.mjs";
import { Moment } from "../../../../models/index.mjs";

export const reportMoment = async (_, { momentId, reason }, { user }) => {
  try {
    isUser(user);

    // Verify the moment exists
    const moment = await Moment.findById(momentId);
    if (!moment) {
      throw new Error("Moment not found.");
    }

    // Check if the reporter has already reported the moment
    const alreadyReported = moment.reports.some(
      (report) => report.reporter.toString() === user.toString()
    );
    if (alreadyReported) {
      throw new Error("You have already reported this moment.");
    }

    // Add the report to the moment
    moment.reports.push({ reporter: user, reason });
    await moment.save();

    return {
      success: true,
      message: "Moment successfully reported.",
    };
  } catch (error) {
    console.error(`Report Moment Error: ${error.message}`);
    throw new Error("An error occurred during moment reporting.");
  }
};
