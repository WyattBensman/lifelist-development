import { User } from "../../../../models/index.mjs";

export const getUserCollages = async (_, { userId }) => {
  try {
    const user = await User.findById(userId).populate("collages");

    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};
