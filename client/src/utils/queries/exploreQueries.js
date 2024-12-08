import { gql } from "@apollo/client";

export const GET_RECOMMENDED_STORIES = gql`
  query GetRecommendedStories($cursor: String, $limit: Int!) {
    getRecommendedStories(cursor: $cursor, limit: $limit) {
      stories {
        _id
        author {
          _id
          username
          fullName
          profilePicture
          followersCount
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
      cursor
      hasNextPage
    }
  }
`;
