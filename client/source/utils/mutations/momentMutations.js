import { gql } from "@apollo/client";

// === Mutation: Post a New Moment === //

export const POST_MOMENT = gql`
  mutation PostMoment($cameraShotId: ID!) {
    postMoment(cameraShotId: $cameraShotId) {
      _id
      createdAt
      expiresAt
      success
      message
    }
  }
`;

// === Mutation: Delete an Existing Moment === //

export const DELETE_MOMENT = gql`
  mutation DeleteMoment($momentId: ID!) {
    deleteMoment(momentId: $momentId) {
      deletedMomentId
      success
      message
    }
  }
`;

// === Mutation: Mark Moment as Viewed === //

export const MARK_MOMENT_AS_VIEWED = gql`
  mutation MarkMomentAsViewed($momentId: ID!) {
    markMomentAsViewed(momentId: $momentId)
  }
`;

// === Mutation: Like a Moment === //

export const LIKE_MOMENT = gql`
  mutation LikeMoment($momentId: ID!) {
    likeMoment(momentId: $momentId) {
      success
      message
      momentId
    }
  }
`;

// === Mutation: Unlike a Moment === //

export const UNLIKE_MOMENT = gql`
  mutation UnlikeMoment($momentId: ID!) {
    unlikeMoment(momentId: $momentId) {
      success
      message
      momentId
    }
  }
`;

// === Mutation: Report a Moment === //

export const REPORT_MOMENT = gql`
  mutation ReportMoment($momentId: ID!, $reason: String!) {
    reportMoment(momentId: $momentId, reason: $reason) {
      success
      message
    }
  }
`;
