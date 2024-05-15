import { gql } from "@apollo/client";

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
