import { User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";

const updateIdentity = async (_, { gender, birthday }, { user }) => {
  try {
    /* isUser(user); */
    const user = await User.findById("65e72e4e82f12a087695250d");

    // Update the user's identity information
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        gender,
        birthday,
      },
      { new: true, runValidators: true }
    );

    return {
      gender: updatedUser.gender,
      birthday: updatedUser.birthday,
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during identity information update");
  }
};

export default updateIdentity;
