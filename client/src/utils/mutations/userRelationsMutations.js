import { gql } from "@apollo/client";

// Follow another user
export const FOLLOW_USER = gql`
  mutation FollowUser($userIdToFollow: ID!) {
    followUser(userIdToFollow: $userIdToFollow) {
      success
      message
    }
  }
`;

// Unfollow another user
export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userIdToUnfollow: ID!) {
    unfollowUser(userIdToUnfollow: $userIdToUnfollow) {
      success
      message
    }
  }
`;

// Send a follow request to another user
export const SEND_FOLLOW_REQUEST = gql`
  mutation SendFollowRequest($userIdToFollow: ID!) {
    sendFollowRequest(userIdToFollow: $userIdToFollow) {
      success
      message
    }
  }
`;

// Unsend a follow request to another user
export const UNSEND_FOLLOW_REQUEST = gql`
  mutation UnsendFollowRequest($userIdToUnfollow: ID!) {
    unsendFollowRequest(userIdToUnfollow: $userIdToUnfollow) {
      success
      message
    }
  }
`;

// Accept a follow request from another user
export const ACCEPT_FOLLOW_REQUEST = gql`
  mutation AcceptFollowRequest($userIdToAccept: ID!) {
    acceptFollowRequest(userIdToAccept: $userIdToAccept) {
      success
      message
    }
  }
`;

// Deny a follow request from another user
export const DENY_FOLLOW_REQUEST = gql`
  mutation DenyFollowRequest($userIdToDeny: ID!) {
    denyFollowRequest(userIdToDeny: $userIdToDeny) {
      success
      message
    }
  }
`;

// Block another user
export const BLOCK_USER = gql`
  mutation BlockUser($userIdToBlock: ID!) {
    blockUser(userIdToBlock: $userIdToBlock) {
      success
      message
    }
  }
`;

// Unblock another user
export const UNBLOCK_USER = gql`
  mutation UnblockUser($userIdToUnblock: ID!) {
    unblockUser(userIdToUnblock: $userIdToUnblock) {
      success
      message
      userIdToUnblock
    }
  }
`;
