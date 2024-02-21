import { User } from "../../../../../models/index.mjs";

export const getUserArchives = async (_, { userId }) => {
  try {
    const user = await User.findById(userId).populate("archivedCollages");

    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};
