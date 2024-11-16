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
    }
  }
`;

// Get User Followers & Following Counts
export const GET_USER_COUNTS = gql`
  query GetUserCounts($userId: ID!) {
    getUserCounts(userId: $userId) {
      collagesCount
      followersCount
      followingCount
    }
  }
`;

// Check Following
export const CHECK_IS_FOLLOWING = gql`
  query CheckIsFollowing($userId: ID!) {
    checkIsFollowing(userId: $userId) {
      isFollowing
    }
  }
`;

// Followers
export const GET_FOLLOWERS = gql`
  query GetFollowers($userId: ID!, $cursor: ID, $limit: Int) {
    getFollowers(userId: $userId, cursor: $cursor, limit: $limit) {
      users {
        user {
          _id
          username
          fullName
          profilePicture
          settings {
            isProfilePrivate
          }
        }
        relationshipStatus
        hasSentFollowRequest
      }
      nextCursor
      hasNextPage
    }
  }
`;

// Following
export const GET_FOLLOWING = gql`
  query GetFollowing($userId: ID!, $cursor: ID, $limit: Int) {
    getFollowing(userId: $userId, cursor: $cursor, limit: $limit) {
      users {
        user {
          _id
          username
          fullName
          profilePicture
          settings {
            isProfilePrivate
          }
        }
        relationshipStatus
        hasSentFollowRequest
      }
      nextCursor
      hasNextPage
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
  query GetTaggedCollages($userId: ID!, $cursor: ID, $limit: Int) {
    getTaggedCollages(userId: $userId, cursor: $cursor, limit: $limit) {
      collages {
        _id
        coverImage
      }
      nextCursor
      hasNextPage
    }
  }
`;

// User's Liked Collages
export const GET_LIKED_COLLAGES = gql`
  query GetLikedCollages($cursor: ID, $limit: Int) {
    getLikedCollages(cursor: $cursor, limit: $limit) {
      collages {
        _id
        coverImage
      }
      nextCursor
      hasNextPage
    }
  }
`;

// User's Saved Collages
export const GET_SAVED_COLLAGES = gql`
  query GetSavedCollages($cursor: ID, $limit: Int) {
    getSavedCollages(cursor: $cursor, limit: $limit) {
      collages {
        _id
        coverImage
      }
      nextCursor
      hasNextPage
    }
  }
`;

// User's Archived Collages
export const GET_ARCHIVED_COLLAGES = gql`
  query GetArchivedCollages($cursor: ID, $limit: Int) {
    getArchivedCollages(cursor: $cursor, limit: $limit) {
      collages {
        _id
        coverImage
      }
      nextCursor
      hasNextPage
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

// User Settings Information
export const GET_USER_DATA = gql`
  query GetUserData {
    getUserData {
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
