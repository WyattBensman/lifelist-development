import { gql } from "@apollo/client";

// === Mutation: Create Camera Shot === //

export const CREATE_CAMERA_SHOT = gql`
  mutation CreateCameraShot($image: String!, $thumbnail: String!) {
    createCameraShot(image: $image, thumbnail: $thumbnail) {
      success
      message
      cameraShot {
        _id
        imageThumbnail
        developingTime
        isDeveloped
        readyToReviewAt
        transferredToRoll
      }
    }
  }
`;

// === Mutation: Transfer Camera Shot to Camera Roll === //

export const GET_AND_TRANSFER_CAMERA_SHOT = gql`
  mutation GetAndTransferCameraShot($shotId: ID!) {
    getAndTransferCameraShot(shotId: $shotId) {
      success
      message
      cameraShot {
        _id
        image
        imageThumbnail
        capturedAt
      }
    }
  }
`;

// === Mutation: Delete Camera Shot === //

export const DELETE_CAMERA_SHOT = gql`
  mutation DeleteCameraShot($shotId: ID!) {
    deleteCameraShot(shotId: $shotId) {
      success
      message
    }
  }
`;

// === Mutation: Create Camera Album === //

export const CREATE_CAMERA_ALBUM = gql`
  mutation CreateCameraAlbum(
    $title: String!
    $shots: [ID]
    $shotsCount: Int
    $coverImage: String
  ) {
    createCameraAlbum(
      title: $title
      shots: $shots
      shotsCount: $shotsCount
      coverImage: $coverImage
    ) {
      success
      message
      albumId
    }
  }
`;

// === Mutation: Edit Camera Album === //

export const EDIT_CAMERA_ALBUM = gql`
  mutation EditCameraAlbum($albumId: ID!, $title: String) {
    editCameraAlbum(albumId: $albumId, title: $title) {
      _id
      title
      shots {
        _id
        image
      }
    }
  }
`;

// === Mutation: Delete Camera Album === //

export const DELETE_CAMERA_ALBUM = gql`
  mutation DeleteCameraAlbum($albumId: ID!) {
    deleteCameraAlbum(albumId: $albumId) {
      success
      message
    }
  }
`;

// === Mutation: Update Shots in Album === //

export const UPDATE_ALBUM_SHOTS = gql`
  mutation UpdateAlbumShots($albumId: ID!, $shotIds: [ID]!) {
    updateAlbumShots(albumId: $albumId, shotIds: $shotIds) {
      success
      message
    }
  }
`;
