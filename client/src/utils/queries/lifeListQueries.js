import { gql } from "@apollo/client";

export const GET_USER_LIFELIST = gql`
  query GetUserLifeList($userId: ID!, $cursor: ID, $limit: Int) {
    getUserLifeList(userId: $userId, cursor: $cursor, limit: $limit) {
      _id
      experiences {
        _id
        list
        experience {
          _id
          title
          image
          category
          subCategory
        }
        hasAssociatedShots
        associatedShots {
          _id
          capturedAt
          image
          imageThumbnail
        }
      }
      nextCursor
      hasNextPage
    }
  }
`;

export const GET_LIFELIST_EXPERIENCE = gql`
  query GetLifeListExperience($experienceId: ID!, $cursor: ID, $limit: Int) {
    getLifeListExperience(
      experienceId: $experienceId
      cursor: $cursor
      limit: $limit
    ) {
      lifeListExperience {
        _id
        list
        experience {
          _id
          image
          title
          category
          subCategory
        }
        associatedShots {
          _id
          capturedAt
          image
          imageThumbnail
        }
      }
      nextCursor
      hasNextPage
    }
  }
`;
