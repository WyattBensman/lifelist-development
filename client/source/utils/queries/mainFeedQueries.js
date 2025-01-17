import { gql } from "@apollo/client";

// === Query: Get Main Feed === //

export const GET_MAIN_FEED = gql`
  query GetMainFeed($userId: ID!, $page: Int!) {
    getMainFeed(userId: $userId, page: $page) {
      collages {
        _id
        coverImage
        author {
          _id
          username
          fullName
          profilePicture
        }
        createdAt
      }
      hasMore
    }
  }
`;
