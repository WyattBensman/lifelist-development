import { gql } from "@apollo/client";

export const UPDATE_USER_DATA = gql`
  mutation UpdateUserData(
    $email: String
    $currentPassword: String
    $newPassword: String
    $phoneNumber: String
    $profilePicture: Upload
    $fullName: String
    $username: String
    $bio: String
    $gender: String
    $birthday: String
    $isProfilePrivate: Boolean
    $darkMode: Boolean
    $language: String
    $notifications: Boolean
    $postRepostToMainFeed: Boolean
  ) {
    updateUserData(
      email: $email
      currentPassword: $currentPassword
      newPassword: $newPassword
      phoneNumber: $phoneNumber
      profilePicture: $profilePicture
      fullName: $fullName
      username: $username
      bio: $bio
      gender: $gender
      birthday: $birthday
      isProfilePrivate: $isProfilePrivate
      darkMode: $darkMode
      language: $language
      notifications: $notifications
      postRepostToMainFeed: $postRepostToMainFeed
    ) {
      success
      message
      user {
        profilePicture
        fullName
        username
        bio
        birthday
        gender
        email
        phoneNumber
        settings {
          isProfilePrivate
          darkMode
          language
          notifications
          postRepostToMainFeed
        }
      }
    }
  }
`;

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
    $isProfilePrivate: Boolean
    $darkMode: Boolean
    $language: String
    $notifications: Boolean
    $postRepostToMainFeed: Boolean
  ) {
    updateSettings(
      isProfilePrivate: $isProfilePrivate
      darkMode: $darkMode
      language: $language
      notifications: $notifications
      postRepostToMainFeed: $postRepostToMainFeed
    ) {
      isProfilePrivate
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
