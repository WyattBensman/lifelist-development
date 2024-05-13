import { gql } from "@apollo/client";

// Save a collage
export const SAVE_COLLAGE = gql`
  mutation SaveCollage($collageId: ID!) {
    saveCollage(collageId: $collageId) {
      success
      message
      action
    }
  }
`;

// Unsave a collage
export const UNSAVE_COLLAGE = gql`
  mutation UnsaveCollage($collageId: ID!) {
    unsaveCollage(collageId: $collageId) {
      success
      message
      action
    }
  }
`;

// Repost a collage
export const REPOST_COLLAGE = gql`
  mutation RepostCollage($collageId: ID!) {
    repostCollage(collageId: $collageId) {
      success
      message
      action
    }
  }
`;

// Unrepost a collage
export const UNREPOST_COLLAGE = gql`
  mutation UnrepostCollage($collageId: ID!) {
    unrepostCollage(collageId: $collageId) {
      success
      message
      action
    }
  }
`;

// Like a collage
export const LIKE_COLLAGE = gql`
  mutation LikeCollage($collageId: ID!) {
    likeCollage(collageId: $collageId) {
      success
      message
      action
    }
  }
`;

// Unlike a collage
export const UNLIKE_COLLAGE = gql`
  mutation UnlikeCollage($collageId: ID!) {
    unlikeCollage(collageId: $collageId) {
      success
      message
      action
    }
  }
`;

// Archive a collage
export const ARCHIVE_COLLAGE = gql`
  mutation ArchiveCollage($collageId: ID!) {
    archiveCollage(collageId: $collageId) {
      success
      message
      action
    }
  }
`;

// Unarchive a collage
export const UNARCHIVE_COLLAGE = gql`
  mutation UnarchiveCollage($collageId: ID!) {
    unarchiveCollage(collageId: $collageId) {
      success
      message
      action
    }
  }
`;

// Create a comment on a collage
export const CREATE_COMMENT = gql`
  mutation CreateComment($collageId: ID!, $text: String!) {
    createComment(collageId: $collageId, text: $text) {
      success
      message
      action
    }
  }
`;

// Edit a comment
export const EDIT_COMMENT = gql`
  mutation EditComment($commentId: ID!, $newText: String!) {
    editComment(commentId: $commentId, newText: $newText) {
      success
      message
      action
    }
  }
`;

// Delete a comment
export const DELETE_COMMENT = gql`
  mutation DeleteComment($collageId: ID!, $commentId: ID!) {
    deleteComment(collageId: $collageId, commentId: $commentId) {
      success
      message
      action
    }
  }
`;

// Delete a collage
export const DELETE_COLLAGE = gql`
  mutation DeleteCollage($collageId: ID!) {
    deleteCollage(collageId: $collageId) {
      success
      message
      action
    }
  }
`;

// Report a collage
export const REPORT_COLLAGE = gql`
  mutation ReportCollage($collageId: ID!, $reason: ReportReason!) {
    reportCollage(collageId: $collageId, reason: $reason) {
      success
      message
      action
    }
  }
`;

// Report a comment
export const REPORT_COMMENT = gql`
  mutation ReportComment($commentId: ID!, $reason: ReportReason!) {
    reportComment(commentId: $commentId, reason: $reason) {
      success
      message
      action
    }
  }
`;
