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
