import { gql } from "@apollo/client";

export const GET_USER_STORIES = gql`
  query GetUserStories($userId: ID!) {
    getUserStories(userId: $userId) {
      _id
      author {
        _id
        username
        fullName
        profilePicture
      }
      cameraShot {
        _id
        image
        imageThumbnail
      }
      createdAt
      expiresAt
      views {
        _id
      }
    }
  }
`;

export const GET_FOLLOWING_USERS_STORIES = gql`
  query GetFollowingUsersStories {
    getFollowingUsersStories {
      _id
      author {
        _id
        username
        fullName
        profilePicture
      }
      cameraShot {
        _id
        image
        imageThumbnail
      }
      createdAt
      expiresAt
      views
      likes
    }
  }
`;

export const GET_STORY_LIKES = gql`
  query GetStoryLikes($storyId: ID!) {
    getStoryLikes(storyId: $storyId) {
      _id
      fullName
      username
      profilePicture
    }
  }
`;
