import { gql } from "@apollo/client";

// === Query: Get Recommended Profiles === //

export const GET_RECOMMENDED_PROFILES = gql`
  query GetRecommendedProfiles($cursor: ID, $limit: Int, $recentlySeen: [ID]) {
    getRecommendedProfiles(
      cursor: $cursor
      limit: $limit
      recentlySeen: $recentlySeen
    ) {
      hasNextPage
      nextCursor
      profiles {
        _id
        fullName
        username
        profilePicture
      }
    }
  }
`;

// === Query: Get Recommended Collages === //

export const GET_RECOMMENDED_COLLAGES = gql`
  query GetRecommendedCollages($cursor: ID, $limit: Int, $recentlySeen: [ID]) {
    getRecommendedCollages(
      cursor: $cursor
      limit: $limit
      recentlySeen: $recentlySeen
    ) {
      collages {
        _id
        coverImage
        createdAt
        author {
          _id
          username
          fullName
          profilePicture
        }
      }
      nextCursor
      hasNextPage
    }
  }
`;
