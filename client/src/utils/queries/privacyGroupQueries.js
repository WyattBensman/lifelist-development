import { gql } from "@apollo/client";

export const GET_ALL_PRIVACY_GROUPS = gql`
  query GetAllPrivacyGroups {
    getAllPrivacyGroups {
      _id
      groupName
      users {
        _id
        fullName
        username
      }
    }
  }
`;

export const GET_PRIVACY_GROUP = gql`
  query GetPrivacyGroup($privacyGroupId: ID!) {
    getPrivacyGroup(privacyGroupId: $privacyGroupId) {
      _id
      groupName
      users {
        _id
        fullName
        username
        profilePicture
      }
    }
  }
`;
