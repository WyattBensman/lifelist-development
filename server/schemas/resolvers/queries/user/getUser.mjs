import { User } from "../../../../models/index.mjs";

export const getUser = async (_, { userId }) => {
  try {
    const user = await User.findById(userId);

    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};
