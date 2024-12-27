import { gql } from "@apollo/client";

// === Mutation: Follow a User === //

export const FOLLOW_USER = gql`
  mutation FollowUser($userIdToFollow: ID!) {
    followUser(userIdToFollow: $userIdToFollow) {
      success
      message
    }
  }
`;

// === Mutation: Unfollow a User === //

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userIdToUnfollow: ID!) {
    unfollowUser(userIdToUnfollow: $userIdToUnfollow) {
      success
      message
    }
  }
`;

// === Mutation: Send Follow Request === //

export const SEND_FOLLOW_REQUEST = gql`
  mutation SendFollowRequest($userIdToFollow: ID!) {
    sendFollowRequest(userIdToFollow: $userIdToFollow) {
      success
      message
    }
  }
`;

// === Mutation: Unsend Follow Request === //

export const UNSEND_FOLLOW_REQUEST = gql`
  mutation UnsendFollowRequest($userIdToUnfollow: ID!) {
    unsendFollowRequest(userIdToUnfollow: $userIdToUnfollow) {
      success
      message
    }
  }
`;

// === Mutation: Accept Follow Request === //

export const ACCEPT_FOLLOW_REQUEST = gql`
  mutation AcceptFollowRequest($userIdToAccept: ID!) {
    acceptFollowRequest(userIdToAccept: $userIdToAccept) {
      success
      message
    }
  }
`;

// === Mutation: Deny Follow Request === //

export const DENY_FOLLOW_REQUEST = gql`
  mutation DenyFollowRequest($userIdToDeny: ID!) {
    denyFollowRequest(userIdToDeny: $userIdToDeny) {
      success
      message
    }
  }
`;

// === Mutation: Block a User === //

export const BLOCK_USER = gql`
  mutation BlockUser($userIdToBlock: ID!) {
    blockUser(userIdToBlock: $userIdToBlock) {
      success
      message
    }
  }
`;

// === Mutation: Unblock a User === //

export const UNBLOCK_USER = gql`
  mutation UnblockUser($userIdToUnblock: ID!) {
    unblockUser(userIdToUnblock: $userIdToUnblock) {
      success
      message
      userIdToUnblock
    }
  }
`;
