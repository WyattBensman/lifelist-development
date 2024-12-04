import { gql } from "@apollo/client";

export const GET_CURRENT_USER_LIFELIST = gql`
  query GetCurrentUserLifeList {
    getCurrentUserLifeList {
      _id
      experiences {
        _id
        list
        associatedCollages {
          _id
        }
        associatedShots {
          _id
        }
        experience {
          _id
          title
          image
          category
          subCategory
        }
      }
    }
  }
`;

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
          imageThumbnail
        }
      }
      nextCursor
      hasNextPage
    }
  }
`;

export const GET_EXPERIENCED_LIST = gql`
  query GetExperiencedList($lifeListId: ID!) {
    getExperiencedList(lifeListId: $lifeListId) {
      _id
      list
      experience {
        _id
        category
        title
        image
        subCategory
      }
      associatedCollages {
        _id
      }
      associatedShots {
        _id
      }
    }
  }
`;

export const GET_WISHLISTED_LIST = gql`
  query GetWishListedList($lifeListId: ID!) {
    getWishListedList(lifeListId: $lifeListId) {
      _id
      list
      experience {
        _id
        category
        title
        image
        subCategory
      }
      associatedCollages {
        _id
      }
      associatedShots {
        _id
      }
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
          imageThumbnail
        }
      }
      nextCursor
      hasNextPage
    }
  }
`;

export const GET_LIFELIST_EXPERIENCES_BY_EXPERIENCE_IDS = gql`
  query GetLifeListExperiencesByExperienceIds(
    $lifeListId: ID!
    $experienceIds: [ID]
  ) {
    getLifeListExperiencesByExperienceIds(
      lifeListId: $lifeListId
      experienceIds: $experienceIds
    ) {
      _id
      lifeList {
        _id
      }
      experience {
        _id
        title
        image
        category
        subCategory
      }
      list
      associatedShots {
        shot {
          _id
          image
          capturedAt
        }
        isHidden
      }
      associatedCollages {
        _id
        coverImage
        createdAt
      }
    }
  }
`;
