import { gql } from "@apollo/client";

// Create a new privacy group
export const CREATE_PRIVACY_GROUP = gql`
  mutation CreatePrivacyGroup($groupName: String!, $userIds: [ID]!) {
    createPrivacyGroup(groupName: $groupName, userIds: $userIds) {
      _id
      groupName
      users {
        _id
        username
        fullName
        profilePicture
      }
    }
  }
`;

// Edit an existing privacy group
export const EDIT_PRIVACY_GROUP = gql`
  mutation EditPrivacyGroup($privacyGroupId: ID!, $newGroupName: String!) {
    editPrivacyGroup(
      privacyGroupId: $privacyGroupId
      newGroupName: $newGroupName
    ) {
      _id
      groupName
      users {
        _id
        username
        fullName
        profilePicture
      }
    }
  }
`;

// Delete a privacy group
export const DELETE_PRIVACY_GROUP = gql`
  mutation DeletePrivacyGroup($privacyGroupId: ID!) {
    deletePrivacyGroup(privacyGroupId: $privacyGroupId) {
      success
      message
    }
  }
`;

// Add users to a privacy group
export const ADD_USERS_TO_PRIVACY_GROUP = gql`
  mutation AddUsersToPrivacyGroup($privacyGroupId: ID!, $userIds: [ID]!) {
    addUsersToPrivacyGroup(privacyGroupId: $privacyGroupId, userIds: $userIds) {
      _id
      groupName
      users {
        _id
        username
        fullName
        profilePicture
      }
    }
  }
`;

// Remove users from a privacy group
export const REMOVE_USERS_FROM_PRIVACY_GROUP = gql`
  mutation RemoveUsersFromPrivacyGroup($privacyGroupId: ID!, $userIds: [ID]!) {
    removeUsersFromPrivacyGroup(
      privacyGroupId: $privacyGroupId
      userIds: $userIds
    ) {
      _id
      groupName
      users {
        _id
        username
        fullName
        profilePicture
      }
    }
  }
`;
