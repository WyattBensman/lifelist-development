import { gql } from "@apollo/client";

// === Mutation: Create a Profile === //

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

// === Mutation: Validate Contact and Birthday === //

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

// === Mutation: Validate Username and Password === //

export const VALIDATE_USERNAME_AND_PASSWORD = gql`
  mutation ValidateUsernameAndPassword($username: String!, $password: String!) {
    validateUsernameAndPassword(username: $username, password: $password) {
      success
      message
    }
  }
`;

// === Mutation: Login === //

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

// === Mutation: Invite a Friend === //

export const INVITE_FRIEND = gql`
  mutation InviteFriend($name: String!, $phoneNumber: String!) {
    inviteFriend(name: $name, phoneNumber: $phoneNumber) {
      success
      message
    }
  }
`;

// === Mutation: Update Invite Status === //

export const UPDATE_INVITE_STATUS = gql`
  mutation UpdateInviteStatus($inviteCode: String!) {
    updateInviteStatus(inviteCode: $inviteCode) {
      success
      message
    }
  }
`;
