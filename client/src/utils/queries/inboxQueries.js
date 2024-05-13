import { gql } from "@apollo/client";

// Fetch all conversations for the user
export const GET_USER_CONVERSATIONS = gql`
  query GetUserConversations {
    getUserConversations {
      _id
      lastMessage {
        _id
        content
        sentAt
        sender {
          _id
          username
          fullName
          profilePicture
        }
      }
      participants {
        _id
        username
        fullName
        profilePicture
      }
    }
  }
`;

// Fetch a specific conversation by ID
export const GET_CONVERSATION = gql`
  query GetConversation($conversationId: ID!) {
    getConversation(conversationId: $conversationId) {
      _id
      messages {
        _id
        content
        sentAt
        sender {
          _id
          username
          fullName
          profilePicture
        }
      }
      participants {
        _id
        username
        fullName
        profilePicture
      }
    }
  }
`;

// Fetch unread messages count for the user
export const GET_UNREAD_MESSAGES_COUNT = gql`
  query GetUnreadMessagesCount {
    getUnreadMessagesCount
  }
`;

// Fetch all notifications for the user
export const GET_USER_NOTIFICATIONS = gql`
  query GetUserNotifications {
    getUserNotifications {
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
  }
`;

// Fetch all follow requests for the user
export const GET_USER_FOLLOW_REQUESTS = gql`
  query GetUserFollowRequests {
    getUserFollowRequests {
      _id
      status
      userId {
        _id
        username
        fullName
        profilePicture
      }
    }
  }
`;
