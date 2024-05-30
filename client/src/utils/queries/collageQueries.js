import { gql } from "@apollo/client";

// Fetch a specific collage by ID
export const GET_COLLAGE_BY_ID = gql`
  query GetCollageById($collageId: ID!) {
    getCollageById(collageId: $collageId) {
      _id
      title
      images
      coverImage
      author {
        _id
        username
        fullName
        profilePicture
      }
      createdAt
    }
  }
`;

// Fetch comments for a specific collage
export const GET_COMMENTS = gql`
  query GetComments($collageId: ID!) {
    getComments(collageId: $collageId) {
      _id
      text
      createdAt
      author {
        _id
        username
        fullName
        profilePicture
      }
    }
  }
`;

// Fetch tagged users in a specific collage
export const GET_TAGGED_USERS = gql`
  query GetTaggedUsers($collageId: ID!) {
    getTaggedUsers(collageId: $collageId) {
      _id
      username
      fullName
      profilePicture
    }
  }
`;

// Fetch interactions counts (likes, reposts, saves, comments) for a specific collage
export const GET_INTERACTIONS = gql`
  query GetInteractions($collageId: ID!) {
    getInteractions(collageId: $collageId) {
      likes
      reposts
      saves
      comments
    }
  }
`;