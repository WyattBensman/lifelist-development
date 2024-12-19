import { gql } from "@apollo/client";

// Create Collage
export const CREATE_COLLAGE = gql`
  mutation CreateCollage(
    $caption: String
    $images: [String]!
    $taggedUsers: [ID]
    $coverImage: String
  ) {
    createCollage(
      caption: $caption
      images: $images
      taggedUsers: $taggedUsers
      coverImage: $coverImage
    ) {
      success
      message
      collage {
        _id
        coverImage
        createdAt
      }
    }
  }
`;

// Edit Collage
export const UPDATE_COLLAGE = gql`
  mutation UpdateCollage(
    $collageId: ID!
    $caption: String
    $images: [String]!
    $taggedUsers: [ID]
    $coverImage: String
  ) {
    updateCollage(
      collageId: $collageId
      caption: $caption
      images: $images
      taggedUsers: $taggedUsers
      coverImage: $coverImage
    ) {
      success
      message
    }
  }
`;
