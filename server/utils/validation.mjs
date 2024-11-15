import { User } from "../models/index.mjs";

// Regular expressions
const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;
const phoneNumberRegex = /^\d{10}$/;
const fullNameRegex = /^[a-zA-Z\s]+$/;
const usernameRegex = /^[a-zA-Z]{2}[a-zA-Z0-9._-]*$/;

export const validateFullName = (fullName) => {
  if (!fullNameRegex.test(fullName)) {
    throw new Error(
      "Full name must only contain alphabetic characters and spaces."
    );
  }
  return true;
};

export const isUsernameAvailable = async (username) => {
  if (!usernameRegex.test(username)) {
    throw new Error(
      "Username must start with two alphabetic characters and may include numbers, dots, underscores, or dashes."
    );
  }

  if (username.length < 5 || username.length > 24) {
    throw new Error("Username must be between 5 and 24 characters long.");
  }

  const existingUser = await User.findOne({ username: username.toLowerCase() });
  if (existingUser) {
    throw new Error("The username is already taken.");
  }

  return true;
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must include at least one digit, one uppercase letter, and one special character."
    );
  }

  return true;
};

export const isEmailAvailable = async (email) => {
  if (!emailRegex.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  return true;
};

export const validateBirthday = (birthday) => {
  const currentDate = new Date();
  const userBirthday = new Date(birthday);

  let age = currentDate.getFullYear() - userBirthday.getFullYear();
  const m = currentDate.getMonth() - userBirthday.getMonth();
  if (m < 0 || (m === 0 && currentDate.getDate() < userBirthday.getDate())) {
    age--;
  }

  if (age < 18) {
    throw new Error("You must be at least 18 years old.");
  }

  return true;
};
