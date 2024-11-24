import { gql } from "@apollo/client";

export const CREATE_PROFILE = gql`
  mutation CreateProfile($input: CreateProfileInput!) {
    createProfile(input: $input) {
      token
      user {
        _id
        fullName
        username
        email
        phoneNumber
        profilePicture
        birthday
        gender
      }
    }
  }
`;

export const VALIDATE_CONTACT_AND_BIRTHDAY = gql`
  mutation ValidateContactAndBirthday(
    $email: String
    $phoneNumber: String
    $birthday: String!
  ) {
    validateContactAndBirthday(
      email: $email
      phoneNumber: $phoneNumber
      birthday: $birthday
    ) {
      success
      message
    }
  }
`;

export const VALIDATE_USERNAME_AND_PASSWORD = gql`
  mutation ValidateUsernameAndPassword($username: String!, $password: String!) {
    validateUsernameAndPassword(username: $username, password: $password) {
      success
      message
    }
  }
`;

export const VALIDATE_PROFILE_DETAILS = gql`
  mutation ValidateProfileDetails(
    $fullName: String!
    $gender: String!
    $bio: String
  ) {
    validateProfileDetails(fullName: $fullName, gender: $gender, bio: $bio) {
      success
      message
    }
  }
`;

export const INITIALIZE_REGISTRATION = gql`
  mutation InitializeRegistration(
    $email: String
    $phoneNumber: String
    $birthday: String!
  ) {
    initializeRegistration(
      email: $email
      phoneNumber: $phoneNumber
      birthday: $birthday
    ) {
      success
      message
      token
      user {
        _id
        email
        phoneNumber
      }
    }
  }
`;

export const SET_LOGIN_INFORMATION = gql`
  mutation SetLoginInformation($username: String!, $password: String!) {
    setLoginInformation(username: $username, password: $password) {
      success
      message
      user {
        _id
        username
      }
    }
  }
`;

export const SET_PROFILE_INFORMATION = gql`
  mutation SetProfileInformation(
    $profilePicture: Upload
    $bio: String
    $fullName: String!
    $gender: String!
  ) {
    setProfileInformation(
      profilePicture: $profilePicture
      bio: $bio
      fullName: $fullName
      gender: $gender
    ) {
      success
      message
      user {
        _id
        profilePicture
        bio
        fullName
        gender
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($usernameOrEmailOrPhone: String!, $password: String!) {
    login(
      usernameOrEmailOrPhone: $usernameOrEmailOrPhone
      password: $password
    ) {
      token
      user {
        _id
        username
        email
        phoneNumber
      }
    }
  }
`;

// Mutation to invite a friend
export const INVITE_FRIEND = gql`
  mutation InviteFriend($name: String!, $phoneNumber: String!) {
    inviteFriend(name: $name, phoneNumber: $phoneNumber) {
      success
      message
    }
  }
`;

// Mutation to update the invite status
export const UPDATE_INVITE_STATUS = gql`
  mutation UpdateInviteStatus($inviteCode: String!) {
    updateInviteStatus(inviteCode: $inviteCode) {
      success
      message
    }
  }
`;
