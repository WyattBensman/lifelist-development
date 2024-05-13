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
        }
      }
    }
  }
`;

export const GET_USER_LIFELIST = gql`
  query GetUserLifeList($userId: ID!) {
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
        }
      }
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
  query GetLifeListExperience($experienceId: ID!) {
    getLifeListExperience(experienceId: $experienceId) {
      _id
      list
      experience {
        _id
        image
        title
        category
      }
      associatedCollages {
        _id
        coverImage
      }
      associatedShots {
        isHidden
        shot {
          _id
          image
        }
      }
    }
  }
`;
