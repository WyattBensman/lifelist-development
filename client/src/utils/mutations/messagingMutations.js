import { gql } from "@apollo/client";

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($recipientId: ID!, $message: String) {
    createConversation(recipientId: $recipientId, message: $message) {
      success
      message
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $conversationId: ID!
    $recipientId: ID
    $content: String
  ) {
    sendMessage(
      conversationId: $conversationId
      recipientId: $recipientId
      content: $content
    ) {
      success
      message
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($conversationId: ID!, $messageId: ID!) {
    deleteMessage(conversationId: $conversationId, messageId: $messageId) {
      success
      message
    }
  }
`;

export const MARK_CONVERSATION_AS_READ = gql`
  mutation MarkConversationAsRead($conversationId: ID!) {
    markConversationAsRead(conversationId: $conversationId) {
      success
      message
    }
  }
`;

export const DELETE_CONVERSATION = gql`
  mutation DeleteConversation($conversationId: ID!) {
    deleteConversation(conversationId: $conversationId) {
      success
      message
    }
  }
`;
