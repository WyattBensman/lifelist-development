import { gql } from "@apollo/client";

// Update user's phone number
export const UPDATE_PHONE_NUMBER = gql`
  mutation UpdatePhoneNumber($phoneNumber: String!) {
    updatePhoneNumber(phoneNumber: $phoneNumber) {
      success
      message
      phoneNumber
    }
  }
`;

// Update user's email
export const UPDATE_EMAIL = gql`
  mutation UpdateEmail($email: String!) {
    updateEmail(email: $email) {
      success
      message
      email
    }
  }
`;

// Update user's password
export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($currentPassword: String!, $newPassword: String!) {
    updatePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      success
      message
    }
  }
`;

// Update user's profile
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $profilePicture: Upload
    $fullName: String
    $username: String
    $bio: String
  ) {
    updateProfile(
      profilePicture: $profilePicture
      fullName: $fullName
      username: $username
      bio: $bio
    ) {
      profilePicture
      fullName
      username
      bio
    }
  }
`;

// Update user's identity details
export const UPDATE_IDENTITY = gql`
  mutation UpdateIdentity($gender: String, $birthday: String) {
    updateIdentity(gender: $gender, birthday: $birthday) {
      gender
      birthday
    }
  }
`;

// Update user's settings
export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings(
    $privacy: String
    $darkMode: Boolean
    $language: String
    $notifications: Boolean
    $postRepostToMainFeed: Boolean
  ) {
    updateSettings(
      privacy: $privacy
      darkMode: $darkMode
      language: $language
      notifications: $notifications
      postRepostToMainFeed: $postRepostToMainFeed
    ) {
      privacy
      darkMode
      language
      notifications
      postRepostToMainFeed
    }
  }
`;

// Delete a user
export const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      success
      message
    }
  }
`;
