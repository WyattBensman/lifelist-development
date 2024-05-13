import { gql } from "@apollo/client";

// Create a new notification
export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification(
    $recipientId: ID!
    $senderId: ID!
    $type: String!
    $collageId: ID
    $message: String!
  ) {
    createNotification(
      recipientId: $recipientId
      senderId: $senderId
      type: $type
      collageId: $collageId
      message: $message
    ) {
      success
      message
    }
  }
`;

// Delete a notification
export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notificationId: ID!) {
    deleteNotification(notificationId: $notificationId) {
      success
      message
    }
  }
`;

// Mark all notifications as seen
export const MARK_ALL_NOTIFICATIONS_AS_SEEN = gql`
  mutation MarkAllNotificationsAsSeen {
    markAllNotificationsAsSeen {
      success
      message
    }
  }
`;
