import { gql } from "@apollo/client";

// Create a camera shot
export const CREATE_CAMERA_SHOT = gql`
  mutation CreateCameraShot(
    $image: Upload!
    $camera: CameraType!
    $shotOrientation: ShotOrientation!
  ) {
    createCameraShot(
      image: $image
      camera: $camera
      shotOrientation: $shotOrientation
    ) {
      success
      message
    }
  }
`;

// Edit a camera shot
export const EDIT_CAMERA_SHOT = gql`
  mutation EditCameraShot($shotId: ID!, $camera: CameraType!) {
    editCameraShot(shotId: $shotId, camera: $camera) {
      _id
      camera
      dimensions {
        width
        height
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
    $description: String
    $shots: [ID]
  ) {
    createCameraAlbum(title: $title, description: $description, shots: $shots) {
      _id
      title
      description
      shots {
        _id
        image
      }
    }
  }
`;

// Edit a camera album
export const EDIT_CAMERA_ALBUM = gql`
  mutation EditCameraAlbum(
    $albumId: ID!
    $title: String
    $description: String
  ) {
    editCameraAlbum(
      albumId: $albumId
      title: $title
      description: $description
    ) {
      _id
      title
      description
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

// Add shots to a camera album
export const ADD_SHOTS_TO_ALBUM = gql`
  mutation AddShotsToAlbum($albumId: ID!, $shotIds: [ID]!) {
    addShotsToAlbum(albumId: $albumId, shotIds: $shotIds) {
      _id
      title
      shots {
        _id
        image
      }
    }
  }
`;

// Remove shots from a camera album
export const REMOVE_SHOTS_FROM_ALBUM = gql`
  mutation RemoveShotsFromAlbum($albumId: ID!, $shotIds: [ID]!) {
    removeShotsFromAlbum(albumId: $albumId, shotIds: $shotIds) {
      _id
      title
      shots {
        _id
        image
      }
    }
  }
`;
