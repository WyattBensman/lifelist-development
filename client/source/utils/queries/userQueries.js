import { gql } from "@apollo/client";

// === Query: Get User Profile === //

export const GET_USER_PROFILE = gql`
  query GetUserProfileById(
    $userId: ID!
    $collagesCursor: ID
    $repostsCursor: ID
    $limit: Int = 15
  ) {
    getUserProfileById(
      userId: $userId
      collagesCursor: $collagesCursor
      repostsCursor: $repostsCursor
      limit: $limit
    ) {
      _id
      fullName
      username
      bio
      profilePicture
      collages {
        items {
          _id
          coverImage
        }
        nextCursor
        hasNextPage
      }
      repostedCollages {
        items {
          _id
          coverImage
        }
        nextCursor
        hasNextPage
      }
      collagesCount
      followersCount
      followingCount
      isFollowing
      isFollowedBy
      isFollowRequested
      hasActiveMoments
      isProfilePrivate
      isBlocked
    }
  }
`;

// === Query: Get User Data === //

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

// === Query: Get User Counts === //

export const GET_USER_COUNTS = gql`
  query GetUserCounts($userId: ID!) {
    getUserCounts(userId: $userId) {
      collagesCount
      followersCount
      followingCount
    }
  }
`;

// === Query: Get Current User's Collages, Reposts & Moments === //

export const GET_COLLAGES_REPOSTS_MOMENTS = gql`
  query GetCollagesRepostsMoments(
    $userId: ID!
    $collagesCursor: ID
    $repostsCursor: ID
    $limit: Int = 15
  ) {
    getCollagesRepostsMoments(
      userId: $userId
      collagesCursor: $collagesCursor
      repostsCursor: $repostsCursor
      limit: $limit
    ) {
      collages {
        items {
          _id
          coverImage
        }
        nextCursor
        hasNextPage
      }
      repostedCollages {
        items {
          _id
          coverImage
        }
        nextCursor
        hasNextPage
      }
      moments {
        _id
        createdAt
        expiresAt
      }
    }
  }
`;

// === Query: Check if Following === //

export const CHECK_IS_FOLLOWING = gql`
  query CheckIsFollowing($userId: ID!) {
    checkIsFollowing(userId: $userId) {
      isFollowing
    }
  }
`;

// === Query: Get Followers === //

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

// === Query: Get Following === //

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

// === Query: Get Tagged Collages === //

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

// === Query: Get Liked Collages === //

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

// === Query: Get Saved Collages === //

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

// === Query: Get Archived Collages === //

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

// === Query: Get Blocked Users === //

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

// === Query: Get All Users === //

export const GET_ALL_USERS = gql`
  query GetAllUsers($limit: Int, $cursor: ID, $searchQuery: String) {
    getAllUsers(limit: $limit, cursor: $cursor, searchQuery: $searchQuery) {
      users {
        user {
          _id
          fullName
          username
          profilePicture
        }
        relationshipStatus
        isPrivate
        hasSentFollowRequest
      }
      nextCursor
      hasNextPage
    }
  }
`;
