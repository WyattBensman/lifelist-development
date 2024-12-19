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
      collage {
        _id
        coverImage
        createdAt
      }
    }
  }
`;

// Unrepost a collage
export const UNREPOST_COLLAGE = gql`
  mutation UnrepostCollage($collageId: ID!) {
    unrepostCollage(collageId: $collageId) {
      success
      message
      collageId
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
      collageId
    }
  }
`;

// Unarchive a collage
export const UNARCHIVE_COLLAGE = gql`
  mutation UnarchiveCollage($collageId: ID!) {
    unarchiveCollage(collageId: $collageId) {
      success
      message
      collage {
        _id
        coverImage
        createdAt
      }
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
      collageId
    }
  }
`;

// Report a collage
export const REPORT_COLLAGE = gql`
  mutation ReportCollage($collageId: ID!, $reason: String!) {
    reportCollage(collageId: $collageId, reason: $reason) {
      success
      message
    }
  }
`;

// Report a comment
export const REPORT_COMMENT = gql`
  mutation ReportComment($commentId: ID!, $reason: String!) {
    reportComment(commentId: $commentId, reason: $reason) {
      success
      message
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation LikeComment($commentId: ID!) {
    likeComment(commentId: $commentId) {
      success
      message
      action
    }
  }
`;

export const UNLIKE_COMMENT = gql`
  mutation UnlikeComment($commentId: ID!) {
    unlikeComment(commentId: $commentId) {
      success
      message
      action
    }
  }
`;
