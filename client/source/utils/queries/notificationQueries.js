import { gql } from "@apollo/client";

// === Query: Get User Notifications === //

export const GET_USER_NOTIFICATIONS = gql`
  query GetUserNotifications {
    getUserNotifications {
      notifications {
        _id
        type
        message
        createdAt
        read
        sender {
          _id
          username
          fullName
          profilePicture
        }
      }
      followRequestsCount
      isProfilePrivate
    }
  }
`;

// === Query: Get Follow Requests === //

export const GET_FOLLOW_REQUESTS = gql`
  query GetFollowRequests {
    getFollowRequests {
      _id
      username
      fullName
      profilePicture
    }
  }
`;
