import { gql } from "@apollo/client";

// Get User
export const GET_USER_PROFILE = gql`
  query GetUserProfileById($userId: ID!) {
    getUserProfileById(userId: $userId) {
      _id
      fullName
      username
      bio
      profilePicture
      collages {
        _id
        coverImage
      }
      repostedCollages {
        _id
        coverImage
      }
      collagesCount
    }
  }
`;

// Get User Followers & Following Counts
export const GET_USER_COUNTS = gql`
  query GetUserCounts($userId: ID!) {
    getUserCounts(userId: $userId) {
      followersCount
      followingCount
    }
  }
`;

// Followers
export const GET_FOLLOWERS = gql`
  query GetFollowers($userId: ID!, $limit: Int, $offset: Int) {
    getFollowers(userId: $userId, limit: $limit, offset: $offset) {
      _id
      username
      fullName
      profilePicture
      followRequests
      settings {
        isProfilePrivate
      }
    }
  }
`;

// Following
export const GET_FOLLOWING = gql`
  query GetFollowing($userId: ID!, $limit: Int, $offset: Int) {
    getFollowing(userId: $userId, limit: $limit, offset: $offset) {
      _id
      username
      fullName
      profilePicture
      followRequests
      settings {
        isProfilePrivate
      }
    }
  }
`;

// User Collages
export const GET_USER_COLLAGES = gql`
  query GetUserCollages($userId: ID!) {
    getUserCollages(userId: $userId) {
      _id
      coverImage
    }
  }
`;

// User's Reposted Collages
export const GET_REPOSTED_COLLAGES = gql`
  query GetRepostedCollages($userId: ID!) {
    getRepostedCollages(userId: $userId) {
      _id
      coverImage
    }
  }
`;

// User's Tagged Collages
export const GET_TAGGED_COLLAGES = gql`
  query GetTaggedCollages($userId: ID!) {
    getTaggedCollages(userId: $userId) {
      _id
      coverImage
    }
  }
`;

// User's Liked Collages
export const GET_LIKED_COLLAGES = gql`
  query GetLikedCollages {
    getLikedCollages {
      _id
      coverImage
    }
  }
`;

// User's Saved Collages
export const GET_SAVED_COLLAGES = gql`
  query GetSavedCollages {
    getSavedCollages {
      _id
      coverImage
    }
  }
`;

// User's Archived Collages
export const GET_ARCHIVED_COLLAGES = gql`
  query GetArchivedCollages {
    getArchivedCollages {
      _id
      coverImage
    }
  }
`;

// Blocked Users
export const GET_BLOCKED_USERS = gql`
  query GetBlockedUsers {
    getBlockedUsers {
      _id
      username
      fullName
      profilePicture
    }
  }
`;

// User Profile Information
export const GET_USER_PROFILE_INFORMATION = gql`
  query GetUserProfileInformation {
    getUserProfileInformation {
      profilePicture
      fullName
      username
      bio
      birthday
      gender
    }
  }
`;

// User Contact Information
export const GET_USER_CONTACT_INFORMATION = gql`
  query GetUserContactInformation {
    getUserContactInformation {
      email
      phoneNumber
    }
  }
`;

// User Identity Information
export const GET_USER_IDENTITY_INFORMATION = gql`
  query GetUserIdentityInformation {
    getUserIdentityInformation {
      birthday
      gender
    }
  }
`;

// User Settings Information
export const GET_USER_SETTINGS_INFORMATION = gql`
  query GetUserSettingsInformation {
    getUserSettingsInformation {
      isProfilePrivate
      darkMode
      language
      notifications
      postRepostToMainFeed
    }
  }
`;

// Fetch all users
export const GET_ALL_USERS = gql`
  query GetAllUsers($limit: Int, $offset: Int) {
    getAllUsers(limit: $limit, offset: $offset) {
      _id
      fullName
      username
      profilePicture
      phoneNumber
      email
    }
  }
`;
