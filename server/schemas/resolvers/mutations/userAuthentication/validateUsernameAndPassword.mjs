import {
  isUsernameAvailable,
  validatePassword,
} from "../../../../utils/validation.mjs";

export const validateUsernameAndPassword = async (
  _,
  { username, password }
) => {
  await isUsernameAvailable(username);
  validatePassword(password);

  return {
    success: true,
    message: "Username and password validated successfully.",
  };
};
