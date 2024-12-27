import { gql } from "@apollo/client";

// === Query: Get Collage by ID === //

export const GET_COLLAGE_BY_ID = gql`
  query GetCollageById($collageId: ID!) {
    getCollageById(collageId: $collageId) {
      collage {
        _id
        caption
        images
        coverImage
        author {
          _id
          username
          fullName
          profilePicture
          settings {
            isProfilePrivate
          }
        }
        createdAt
        archived
        tagged {
          _id
          username
          fullName
          profilePicture
        }
      }
      isLikedByCurrentUser
      isRepostedByCurrentUser
      isSavedByCurrentUser
      hasParticipants
    }
  }
`;

// === Query: Get Comments for Collage === //

export const GET_COMMENTS = gql`
  query GetComments($collageId: ID!) {
    getComments(collageId: $collageId) {
      _id
      author {
        _id
        username
        fullName
        profilePicture
      }
      text
      createdAt
      likes
      likedBy {
        _id
      }
    }
  }
`;

// === Query: Get Tagged Users for Collage === //

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

// === Query: Get Interactions for Collage === //

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
