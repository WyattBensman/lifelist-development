import { gql } from "@apollo/client";

// Start creating a new collage with initial images
export const START_COLLAGE = gql`
  mutation StartCollage($images: [Upload]!) {
    startCollage(images: $images) {
      success
      message
      collageId
    }
  }
`;

// Set the cover image of a collage
export const SET_COVER_IMAGE = gql`
  mutation SetCoverImage($collageId: ID!, $selectedImage: String!) {
    setCoverImage(collageId: $collageId, selectedImage: $selectedImage) {
      success
      message
      collageId
    }
  }
`;

// Set the caption for a collage
export const SET_CAPTION = gql`
  mutation SetCaption($collageId: ID!, $caption: String) {
    setCaption(collageId: $collageId, caption: $caption) {
      success
      message
      collageId
    }
  }
`;

// Set the location for a collage
export const SET_LOCATION = gql`
  mutation SetLocation($collageId: ID!, $locations: [LocationInput]!) {
    setLocation(collageId: $collageId, locations: $locations) {
      success
      message
      collageId
    }
  }
`;

// Set the audience for a collage
export const SET_AUDIENCE = gql`
  mutation SetAudience($collageId: ID!, $audience: PrivacySetting!) {
    setAudience(collageId: $collageId, audience: $audience) {
      success
      message
      collageId
    }
  }
`;

// Tag users in a collage
export const TAG_USERS = gql`
  mutation TagUsers($collageId: ID!, $userIds: [ID]!) {
    tagUsers(collageId: $collageId, userIds: $userIds) {
      success
      message
      collageId
    }
  }
`;

// Untag users from a collage
export const UNTAG_USERS = gql`
  mutation UntagUsers($collageId: ID!, $userIds: [ID]!) {
    untagUsers(collageId: $collageId, userIds: $userIds) {
      success
      message
      collageId
    }
  }
`;

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
