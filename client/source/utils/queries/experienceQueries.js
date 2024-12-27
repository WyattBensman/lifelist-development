import { gql } from "@apollo/client";

// === Query: Get Experience by ID === //

export const GET_EXPERIENCE = gql`
  query GetExperience($experienceId: ID!) {
    getExperience(experienceId: $experienceId) {
      _id
      title
      image
      address
      city
      state
      country
      postalCode
      latitude
      longitude
      category
      subCategory
      collages {
        _id
        coverImage
      }
    }
  }
`;

// === Query: Get All Experiences === //

export const GET_ALL_EXPERIENCES = gql`
  query GetAllExperiences($cursor: ID, $limit: Int) {
    getAllExperiences(cursor: $cursor, limit: $limit) {
      experiences {
        _id
        title
        image
        category
        subCategory
      }
      nextCursor
      hasNextPage
    }
  }
`;
