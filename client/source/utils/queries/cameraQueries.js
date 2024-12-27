import { gql } from "@apollo/client";

// === Query: Get Presigned URL for S3 Bucket === //

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

// === Query: Get All Camera Albums === //

export const GET_ALL_CAMERA_ALBUMS = gql`
  query GetAllCameraAlbums {
    getAllCameraAlbums {
      _id
      title
      coverImage
      shotsCount
      shots {
        _id
      }
    }
  }
`;

// === Query: Get Camera Album by ID === //

export const GET_CAMERA_ALBUM = gql`
  query GetCameraAlbum($albumId: ID!, $cursor: ID, $limit: Int) {
    getCameraAlbum(albumId: $albumId, cursor: $cursor, limit: $limit) {
      album {
        _id
        coverImage
        title
      }
      shots {
        _id
        imageThumbnail
        capturedAt
      }
      hasNextPage
      nextCursor
    }
  }
`;

// === Query: Get All Camera Shots === //

export const GET_ALL_CAMERA_SHOTS = gql`
  query GetAllCameraShots($cursor: ID, $limit: Int) {
    getAllCameraShots(cursor: $cursor, limit: $limit) {
      shots {
        _id
        image
        imageThumbnail
        capturedAt
      }
      nextCursor
      hasNextPage
    }
  }
`;

// === Query: Get Camera Shot by ID === //

export const GET_CAMERA_SHOT = gql`
  query GetCameraShot($shotId: ID!) {
    getCameraShot(shotId: $shotId) {
      _id
      image
      capturedAt
    }
  }
`;

// === Query: Get Developing Camera Shots === //

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
