import { gql } from "@apollo/client";

// === Query: Get User Moments === //

export const GET_USER_MOMENTS = gql`
  query GetUserMoments($userId: ID!) {
    getUserMoments(userId: $userId) {
      _id
      author {
        _id
        username
        fullName
        profilePicture
      }
      cameraShot {
        _id
        image
      }
      createdAt
      expiresAt
      views {
        _id
      }
      likes {
        _id
      }
    }
  }
`;

// === Query: Get Friends' Moments === //

export const GET_FRIENDS_MOMENTS = gql`
  query GetFriendsMoments($cursor: String, $limit: Int) {
    getFriendsMoments(cursor: $cursor, limit: $limit) {
      moments {
        _id
        author {
          _id
          username
          fullName
          profilePicture
        }
        cameraShot {
          _id
          image
          imageThumbnail
        }
        createdAt
        expiresAt
        views {
          _id
        }
        likes {
          _id
        }
      }
      nextCursor
      hasNextPage
    }
  }
`;

// === Query: Get Moment Likes === //

export const GET_MOMENT_LIKES = gql`
  query GetMomentLikes($momentId: ID!) {
    getMomentLikes(momentId: $momentId) {
      _id
      fullName
      username
      profilePicture
    }
  }
`;
