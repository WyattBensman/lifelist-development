import { gql } from "@apollo/client";

// Fetch a specific experience by ID
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

// Fetch all experiences
export const GET_ALL_EXPERIENCES = gql`
  query GetAllExperiences($limit: Int, $offset: Int) {
    getAllExperiences(limit: $limit, offset: $offset) {
      _id
      title
      image
      category
      subCategory
    }
  }
`;
