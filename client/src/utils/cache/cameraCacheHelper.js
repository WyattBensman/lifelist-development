import { saveToAsyncStorage, getFromAsyncStorage } from "../cacheHelper";

// Function to cache album metadata
export const cacheAlbumMetadata = async (metadata) => {
  try {
    await saveToAsyncStorage("camera_albums_metadata", metadata);
    console.log("Camera album metadata cached successfully.");
  } catch (error) {
    console.error("Error caching album metadata:", error);
  }
};

// Function to get cached album metadata
export const getCachedAlbumMetadata = async () => {
  try {
    const metadata = await getFromAsyncStorage("camera_albums_metadata");
    return metadata;
  } catch (error) {
    console.error("Error retrieving cached album metadata:", error);
    return null;
  }
};

// Function to cache camera shots
export const cacheCameraShots = async (shots) => {
  try {
    await saveToAsyncStorage("camera_shots", shots);
    console.log("Camera shots cached successfully.");
  } catch (error) {
    console.error("Error caching camera shots:", error);
  }
};

// Function to get cached camera shots
export const getCachedCameraShots = async () => {
  try {
    const shots = await getFromAsyncStorage("camera_shots");
    return shots;
  } catch (error) {
    console.error("Error retrieving cached camera shots:", error);
    return null;
  }
};

/* // Function to save album metadata to AsyncStorage
export const saveAlbumMetadata = async (albumId, metadata) => {
  try {
    await AsyncStorage.setItem(
      `album_metadata_${albumId}`,
      JSON.stringify(metadata)
    );
    console.log("Album metadata cached successfully for:", albumId);
  } catch (error) {
    console.error("Error caching album metadata:", error);
  }
};

// Function to get album metadata from AsyncStorage
export const getAlbumMetadata = async (albumId) => {
  try {
    const metadata = await AsyncStorage.getItem(`album_metadata_${albumId}`);
    return metadata ? JSON.parse(metadata) : null;
  } catch (error) {
    console.error("Error retrieving album metadata:", error);
    return null;
  }
};

// Function to save album cover image to FileSystem
export const saveAlbumCoverImage = async (albumId, imagePath) => {
  try {
    const fileUri = `${FileSystem.documentDirectory}${albumId}_cover.jpg`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      console.log("Album cover image already cached:", fileUri);
      return fileUri;
    }

    // Download and save the image
    const downloadedImage = await FileSystem.downloadAsync(imagePath, fileUri);
    console.log("Album cover image cached at:", downloadedImage.uri);
    return downloadedImage.uri;
  } catch (error) {
    console.error("Error caching album cover image:", error);
    return null;
  }
};

// Function to get album cover image from FileSystem
export const getAlbumCoverImage = async (albumId) => {
  try {
    const fileUri = `${FileSystem.documentDirectory}${albumId}_cover.jpg`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      return fileUri;
    }
    return null;
  } catch (error) {
    console.error("Error retrieving album cover image:", error);
    return null;
  }
};
 */
