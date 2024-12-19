import { gql } from "@apollo/client";

// Create a camera shot
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

// Trasnfer a camera shot to Camera Roll
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

// Delete a camera shot
export const DELETE_CAMERA_SHOT = gql`
  mutation DeleteCameraShot($shotId: ID!) {
    deleteCameraShot(shotId: $shotId) {
      success
      message
    }
  }
`;

// Create a camera album
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

// Edit a camera album
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

// Delete a camera album
export const DELETE_CAMERA_ALBUM = gql`
  mutation DeleteCameraAlbum($albumId: ID!) {
    deleteCameraAlbum(albumId: $albumId) {
      success
      message
    }
  }
`;

// Update shots in album
export const UPDATE_ALBUM_SHOTS = gql`
  mutation UpdateAlbumShots($albumId: ID!, $shotIds: [ID]!) {
    updateAlbumShots(albumId: $albumId, shotIds: $shotIds) {
      success
      message
    }
  }
`;
