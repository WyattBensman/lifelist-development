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

// Delete a user
export const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      success
      message
    }
  }
`;

export const REPORT_PROFILE = gql`
  mutation ReportProfile($profileId: ID!, $reason: String!) {
    reportProfile(profileId: $profileId, reason: $reason) {
      success
      message
    }
  }
`;
