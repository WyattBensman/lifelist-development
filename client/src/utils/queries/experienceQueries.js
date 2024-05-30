import { gql } from "@apollo/client";

// Fetch a specific experience by ID
export const GET_EXPERIENCE = gql`
  query GetExperience($experienceId: ID!) {
    getExperience(experienceId: $experienceId) {
      _id
      title
      image
      location
      coordinates {
        latitude
        longitude
      }
      category
      collages {
        _id
        coverImage
      }
    }
  }
`;

export const GET_ALL_EXPERIENCES = gql`
  query GetAllExperiences {
    getAllExperiences {
      _id
      title
      image
      category
    }
  }
`;