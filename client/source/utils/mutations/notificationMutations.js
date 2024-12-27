import { gql } from "@apollo/client";

// === Mutation: Create a New Notification === //

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

// === Mutation: Delete a Notification === //

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notificationId: ID!) {
    deleteNotification(notificationId: $notificationId) {
      success
      message
    }
  }
`;

// === Mutation: Mark All Notifications as Seen === //

export const MARK_ALL_NOTIFICATIONS_AS_SEEN = gql`
  mutation MarkAllNotificationsAsSeen {
    markAllNotificationsAsSeen {
      success
      message
    }
  }
`;
