import { gql } from "@apollo/client";

// Mutation to post a new moment
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

// Mutation to delete an existing moment
export const DELETE_MOMENT = gql`
  mutation DeleteMoment($momentId: ID!) {
    deleteMoment(momentId: $momentId) {
      deletedMomentId
      success
      message
    }
  }
`;

// Mutation to mark a moment as viewed
export const MARK_MOMENT_AS_VIEWED = gql`
  mutation MarkMomentAsViewed($momentId: ID!) {
    markMomentAsViewed(momentId: $momentId)
  }
`;

export const LIKE_MOMENT = gql`
  mutation LikeMoment($momentId: ID!) {
    likeMoment(momentId: $momentId) {
      success
      message
      momentId
    }
  }
`;

export const UNLIKE_MOMENT = gql`
  mutation UnlikeMoment($momentId: ID!) {
    unlikeMoment(momentId: $momentId) {
      success
      message
      momentId
    }
  }
`;

export const REPORT_MOMENT = gql`
  mutation ReportMoment($momentId: ID!, $reason: String!) {
    reportMoment(momentId: $momentId, reason: $reason) {
      success
      message
    }
  }
`;
