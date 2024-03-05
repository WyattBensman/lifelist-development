import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const removeExperienceFromLifeList = async (_, { experienceId }, { user }) => {
  try {
    // Check if the user is authenticated
    /* isUser(user); */

    const user = User.findById("65e08edb5242a6c8ff3c8152");

    const updatedUser = await User.findByIdAndUpdate(
      "65e08edb5242a6c8ff3c8152",
      {
        $pull: {
          lifeList: { experience: experienceId },
        },
      },
      { new: true }
    );

    return updatedUser.lifeList;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error(
      "An error occurred during removing experience from life list."
    );
  }
};

export default removeExperienceFromLifeList;
