import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { BASE_URL } from "./config";

let cacheStore = {}; // In-memory cache for temporary storage

const DOCUMENT_DIR = FileSystem.documentDirectory;
const CACHE_DIR = FileSystem.cacheDirectory;

const logError = (action, error) => {
  console.error(`[cacheHelper] ${action} failed:`, error.message);
};

// === General File Path Helper === //
const getFilePaths = (key) => ({
  documentPath: `${DOCUMENT_DIR}${key}.jpg`,
  cachePath: `${CACHE_DIR}${key}.jpg`,
});

// === Metadata Helpers === //

export const saveMetadataToCache = async (
  key,
  metadata,
  isPersistent = true
) => {
  try {
    const metadataString = JSON.stringify(metadata);
    if (isPersistent) {
      await AsyncStorage.setItem(key, metadataString);
    } else {
      cacheStore[key] = metadata; // Save to in-memory cache
    }
  } catch (error) {
    logError(`Saving metadata (${key}) to cache`, error);
  }
};

export const getMetadataFromCache = async (key, isPersistent = true) => {
  try {
    if (isPersistent) {
      const metadataString = await AsyncStorage.getItem(key);
      return metadataString ? JSON.parse(metadataString) : null;
    } else {
      return cacheStore[key] || null;
    }
  } catch (error) {
    console.error(`[cacheHelper] Error fetching metadata (${key}):`, error);

    // Fallback from in-memory to persistent storage
    if (!isPersistent) {
      try {
        const metadataString = await AsyncStorage.getItem(key);
        return metadataString ? JSON.parse(metadataString) : null;
      } catch (fallbackError) {
        console.error(
          `[cacheHelper] Fallback metadata fetch failed (${key}):`,
          fallbackError
        );
      }
    }

    return null;
  }
};

export const clearMetadataCache = async (key, isPersistent = true) => {
  try {
    if (isPersistent) {
      await AsyncStorage.removeItem(key);
    } else {
      delete cacheStore[key]; // Remove from in-memory cache
    }
  } catch (error) {
    logError(`Clearing metadata (${key}) cache`, error);
  }
};

// === File System Helpers === //

export const saveImageToFileSystem = async (
  key,
  imagePath,
  isPersistent = false
) => {
  try {
    // Determine the full image URL
    const fullImageUrl = imagePath.startsWith("http")
      ? imagePath
      : `${BASE_URL}${imagePath}`;

    // Extract the file extension
    const fileExtension = imagePath.split(".").pop() || "jpg";

    // Determine the save directory
    const fileUri = `${
      isPersistent ? DOCUMENT_DIR : CACHE_DIR
    }${key}.${fileExtension}`;

    // Check if the file already exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      console.log("Image already exists in file system:", fileUri);
      return fileUri;
    }

    // Download and save the image
    const downloadedImage = await FileSystem.downloadAsync(
      fullImageUrl,
      fileUri
    );
    console.log(
      `Image successfully downloaded and saved at: ${downloadedImage.uri}`
    );

    return downloadedImage.uri;
  } catch (error) {
    console.error(`Error saving image (${key}) to file system:`, error);
    return null;
  }
};

export const getImageFromFileSystem = async (key) => {
  try {
    const { documentPath, cachePath } = getFilePaths(key);

    for (const path of [documentPath, cachePath]) {
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (fileInfo.exists) return path;
    }

    return null; // Image not found
  } catch (error) {
    console.error(`[cacheHelper] Error retrieving image (${key}):`, error);
    return null;
  }
};

export const deleteImageFromFileSystem = async (key) => {
  try {
    const { documentPath, cachePath } = getFilePaths(key);

    for (const path of [documentPath, cachePath]) {
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(path);
        console.log(`[cacheHelper] Image deleted: ${path}`);
        return true;
      }
    }

    console.log(`[cacheHelper] No image found to delete for key: ${key}`);
    return false;
  } catch (error) {
    console.error(`[cacheHelper] Error deleting image (${key}):`, error);
    return false;
  }
};
