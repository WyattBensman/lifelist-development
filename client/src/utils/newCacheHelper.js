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
  isPersistent = true,
  ttl = null // TTL in milliseconds (optional)
) => {
  try {
    const metadataString = JSON.stringify({
      data: metadata,
      timestamp: ttl ? Date.now() : null, // Save timestamp if TTL is provided
      ttl,
    });

    if (isPersistent) {
      await AsyncStorage.setItem(key, metadataString);
    } else {
      cacheStore[key] = metadataString; // Save to in-memory cache
    }
  } catch (error) {
    logError(`Saving metadata (${key}) to cache`, error);
  }
};

export const getMetadataFromCache = async (key, isPersistent = true) => {
  try {
    const metadataString = isPersistent
      ? await AsyncStorage.getItem(key)
      : cacheStore[key];

    if (!metadataString) return null;

    const { data, timestamp, ttl } = JSON.parse(metadataString);

    if (ttl && timestamp) {
      const isExpired = Date.now() > timestamp + ttl;
      if (isExpired) {
        console.log(`[cacheHelper] Metadata (${key}) expired`);
        clearMetadataCache(key, isPersistent); // Auto-clear expired metadata
        return null;
      }
    }

    return data;
  } catch (error) {
    console.error(`[cacheHelper] Error fetching metadata (${key}):`, error);
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
  isPersistent = false,
  ttl = null // TTL in milliseconds (optional)
) => {
  try {
    const fullImageUrl = imagePath.startsWith("http")
      ? imagePath
      : `${BASE_URL}${imagePath}`;
    const fileExtension = imagePath.split(".").pop() || "jpg";

    const fileUri = `${
      isPersistent ? DOCUMENT_DIR : CACHE_DIR
    }${key}.${fileExtension}`;

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      // Check TTL if provided
      if (ttl && fileInfo.modificationTime) {
        const isExpired =
          Date.now() > new Date(fileInfo.modificationTime).getTime() + ttl;
        if (isExpired) {
          await FileSystem.deleteAsync(fileUri);
          console.log(`[cacheHelper] Image (${key}) expired and deleted.`);
        } else {
          console.log("Image already exists and is valid:", fileUri);
          return fileUri;
        }
      } else {
        console.log("Image already exists:", fileUri);
        return fileUri;
      }
    }

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

export const getImageFromFileSystem = async (key, ttl = null) => {
  try {
    const { documentPath, cachePath } = getFilePaths(key);

    for (const path of [documentPath, cachePath]) {
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (fileInfo.exists) {
        // Check TTL if provided
        if (ttl && fileInfo.modificationTime) {
          const isExpired =
            Date.now() > new Date(fileInfo.modificationTime).getTime() + ttl;
          if (isExpired) {
            await FileSystem.deleteAsync(path);
            console.log(`[cacheHelper] Image (${key}) expired and deleted.`);
            return null;
          }
        }
        return path;
      }
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
