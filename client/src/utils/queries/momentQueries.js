import { gql } from "@apollo/client";

// Query to fetch a user's moments
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

// Query to fetch moments from users the current user is following
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

// Query to fetch likes for a specific moment
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
