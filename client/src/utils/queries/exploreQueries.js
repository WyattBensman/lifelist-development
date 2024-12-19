import { gql } from "@apollo/client";

export const GET_RECOMMENDED_PROFILES = gql`
  query GetRecommendedProfiles($cursor: ID, $limit: Int) {
    getRecommendedProfiles(cursor: $cursor, limit: $limit) {
      hasNextPage
      nextCursor
      profiles {
        followerCount
        overlapScore
        user {
          _id
          fullName
          username
          profilePicture
        }
      }
    }
  }
`;

export const GET_RECOMMENDED_COLLAGES = gql`
  query GetRecommendedCollages($cursor: ID, $limit: Int) {
    getRecommendedCollages(cursor: $cursor, limit: $limit) {
      nextCursor
      hasNextPage
      collages {
        _id
        author {
          _id
          username
          fullName
          profilePicture
        }
        coverImage
        createdAt
        likesCount
        overlapScore
        popularityScore
        repostsCount
        savesCount
      }
    }
  }
`;
