import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const updateFlowpageLinks = async (_, { flowpageLinks }, { user }) => {
  try {
    isUser(user);

    // Check for duplicate types in the incoming flowpageLinks
    const uniqueTypes = new Set(flowpageLinks.map((link) => link.type));
    if (uniqueTypes.size !== flowpageLinks.length) {
      throw new Error("Duplicate link types are not allowed.");
    }

    // Check for maximum length
    if (flowpageLinks.length > 8) {
      throw new Error("Cannot have more than 8 Flow Page Links.");
    }

    // Update the user's profile with the new or edited flowpageLinks
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          flowpageLinks: flowpageLinks,
        },
      },
      { new: true, runValidators: true }
    );

    return updatedUser.flowpageLinks;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during flowpageLinks update.");
  }
};

export default updateFlowpageLinks;
