import { gql } from "@apollo/client";

export const GET_PRESIGNED_URL = gql`
  query GetPresignedUrl(
    $folder: String!
    $fileName: String!
    $fileType: String!
  ) {
    getPresignedUrl(folder: $folder, fileName: $fileName, fileType: $fileType) {
      presignedUrl
      fileUrl
    }
  }
`;

// Daily camera shots left for the user
export const GET_DAILY_CAMERA_SHOTS_LEFT = gql`
  query GetDailyCameraShotsLeft {
    getDailyCameraShotsLeft
  }
`;

// Get all camera albums for the user
export const GET_ALL_CAMERA_ALBUMS = gql`
  query GetAllCameraAlbums {
    getAllCameraAlbums {
      _id
      title
      coverImage
      shotsCount
    }
  }
`;

// Get a specific camera album by ID
export const GET_CAMERA_ALBUM = gql`
  query GetCameraAlbum($albumId: ID!) {
    getCameraAlbum(albumId: $albumId) {
      _id
      title
      description
      shots {
        _id
        imageThumbnail
        capturedAt
      }
    }
  }
`;

// Get all camera shots for the user
export const GET_ALL_CAMERA_SHOTS = gql`
  query GetAllCameraShots($cursor: ID, $limit: Int) {
    getAllCameraShots(cursor: $cursor, limit: $limit) {
      shots {
        _id
        imageThumbnail
        capturedAt
      }
      nextCursor
      hasNextPage
    }
  }
`;

// Get a specific camera shot by ID
export const GET_CAMERA_SHOT = gql`
  query GetCameraShot($shotId: ID!) {
    getCameraShot(shotId: $shotId) {
      _id
      image
      capturedAt
    }
  }
`;

// Get all developing camera shots for the user
export const GET_DEVELOPING_CAMERA_SHOTS = gql`
  query GetDevelopingCameraShots {
    getDevelopingCameraShots {
      _id
      imageThumbnail
      capturedAt
      developingTime
      isDeveloped
      readyToReviewAt
      transferredToRoll
    }
  }
`;
