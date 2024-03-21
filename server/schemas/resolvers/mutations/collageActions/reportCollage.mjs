import { Collage } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const reportCollage = async (_, { collageId, reason }, { user }) => {
  try {
    isUser(user);

    const collage = await Collage.findById(collageId);
    if (!collage) {
      throw new Error("Collage not found.");
    }

    // Check if the reporter has already reported the collage
    const alreadyReported = collage.reports.some(
      (report) => report.reporter.toString() === user._id
    );
    if (alreadyReported) {
      throw new Error("You have already reported this collage.");
    }

    // Add the report to the collage
    collage.reports.push({ reporter: user._id, reason });
    await collage.save();

    return {
      success: true,
      message: "Collage reported successfully.",
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during collage reporting.");
  }
};

export default reportCollage;
