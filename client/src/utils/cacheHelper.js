import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { BASE_URL } from "./config";

let cacheStore = {};

// =====================
// Cache Store (Temporary for Metadata)
// =====================

// Save metadata to cache with TTL
export const saveMetaDataToCache = (key, value, ttlInSeconds) => {
  const expires = Date.now() + ttlInSeconds * 1000;
  cacheStore[key] = { value, expires };
};

// Get metadata from cache with expiration check
export const getMetaDataFromCache = (key) => {
  const cacheEntry = cacheStore[key];
  if (!cacheEntry) return null;

  if (Date.now() > cacheEntry.expires) {
    delete cacheStore[key];
    return null;
  }

  return cacheEntry.value;
};

// Clear specific metadata cache
export const clearMetaDataFromCache = (key) => {
  delete cacheStore[key];
};

// =====================
// Image Cache (Temporary for Session)
// =====================

// Save image to FileSystem temporarily for the session
export const saveImageToCache = async (key, imagePath) => {
  try {
    const fullImageUrl = `${BASE_URL}${imagePath}`;

    const fileExtension = imagePath.split(".").pop() || "jpg"; // Get file extension

    const fileUri = `${FileSystem.cacheDirectory}${key}.${fileExtension}`;

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      console.log("Image already exists in cache:", fileUri);
      return fileUri;
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
    console.error("Error saving image to cache:", error);
    return null;
  }
};

// Get image from FileSystem cache
export const getImageFromCache = async (key, imagePath) => {
  try {
    console.log(`Image Path: ${imagePath}`);
    const fileExtension = imagePath.split(".").pop() || "jpg"; // Get file extension
    const fileUri = `${FileSystem.cacheDirectory}${key}.${fileExtension}`;

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      console.log("Retrieved image from cache:", fileUri);
      return fileUri;
    }
    return null;
  } catch (error) {
    console.error("Error getting image from cache:", error);
    return null;
  }
};

export const deleteImageFromFileSystem = async (cacheKey) => {
  try {
    const fileUri = `${FileSystem.documentDirectory}${cacheKey}`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
      console.log(`Deleted cached image: ${fileUri}`);
      return true;
    }
    console.warn(`File does not exist: ${fileUri}`);
    return false;
  } catch (error) {
    console.error(`Failed to delete cached image: ${error.message}`);
    throw error; // Optionally rethrow for higher-level handling
  }
};

// Clear specific image cache
export const clearImageFromCache = async (key, imagePath) => {
  try {
    const fileExtension = imagePath.split(".").pop() || "jpg"; // Get file extension
    const fileUri = `${FileSystem.cacheDirectory}${key}.${fileExtension}`;

    await FileSystem.deleteAsync(fileUri, { idempotent: true });
    console.log("Image cache cleared:", fileUri);
  } catch (error) {
    console.error("Error clearing image from cache:", error);
  }
};

// =====================
// Cleanup Functions
// =====================

// Clear all metadata and image caches
export const clearAllCaches = async () => {
  // Step 1: Clear in-memory metadata cache
  cacheStore = {};

  // Step 2: Clear AsyncStorage while preserving specific keys
  await clearAllAsyncStorage();

  // Step 3: Clear all image and file caches from FileSystem (both cache and document directories)
  await clearAllFileSystemCache();

  console.log(
    "All caches cleared successfully across in-memory, AsyncStorage, and FileSystem."
  );
};

// Cleanup expired metadata items
export const cleanupExpiredMetaData = () => {
  const now = Date.now();
  Object.keys(cacheStore).forEach((key) => {
    if (cacheStore[key].expires < now) {
      delete cacheStore[key];
    }
  });
};

// ========================
// AsyncStorage (Persistent)
// ========================

// Save data to AsyncStorage with optional TTL
export const saveToAsyncStorage = async (key, value, ttlInSeconds = null) => {
  try {
    const data = {
      value,
      expires: ttlInSeconds ? Date.now() + ttlInSeconds * 1000 : null,
    };
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error("Error saving to AsyncStorage:", error);
  }
};

// Get data from AsyncStorage with expiration check
export const getFromAsyncStorage = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (!jsonValue) return null;

    const data = JSON.parse(jsonValue);
    if (data.expires && Date.now() > data.expires) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return data.value;
  } catch (error) {
    console.error("Error retrieving from AsyncStorage:", error);
    return null;
  }
};

// Clear specific persistent cache
export const clearFromAsyncStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from AsyncStorage:", error);
  }
};

// Clear all persistent caches
export const clearAllAsyncStorage = async () => {
  try {
    // Get all keys in AsyncStorage
    const keys = await AsyncStorage.getAllKeys();

    // Keys to preserve
    const keysToPreserve = ["isEarlyAccessUnlocked"];

    // Filter keys to remove
    const keysToRemove = keys.filter((key) => !keysToPreserve.includes(key));

    // Remove only keys that are not preserved
    if (keysToRemove.length > 0) {
      await AsyncStorage.multiRemove(keysToRemove);
    }

    console.log(
      "AsyncStorage cleared except for preserved keys:",
      keysToPreserve
    );
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

// ========================
// File System Cache (Expo)
// ========================

// Helper function to determine file extension
const getFileExtension = (uri) => {
  const parts = uri.split(".");
  return parts.length > 1 ? parts.pop() : "jpg"; // Default to "jpg" if no extension found
};

// Save image to FileSystem with a given key
export const saveImageToFileSystem = async (key, imagePath) => {
  try {
    // Construct the full URL using BASE_URL and the image path
    const fullImageUrl = imagePath;

    // Determine the file extension from the path
    const fileExtension = getFileExtension(imagePath);

    // Create the full file URI with the extension for persistence
    const fileUri = `${FileSystem.documentDirectory}${key}.${fileExtension}`;

    // Check if the file already exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      console.log("Image already exists in document directory:", fileUri);
      return fileUri;
    }

    // Download the image from the full URL
    const downloadedImage = await FileSystem.downloadAsync(
      fullImageUrl,
      fileUri
    );
    console.log(
      `Image successfully downloaded and saved at: ${downloadedImage.uri}`
    );

    // Save the local URI to AsyncStorage for caching reference with a 7-day TTL
    await saveToAsyncStorage(key, downloadedImage.uri, 7 * 24 * 60 * 60);

    console.log(`Image for experience ${key} saved to FileSystem.`);
    return downloadedImage.uri;
  } catch (error) {
    console.error("Error saving image to FileSystem:", error);
    return null;
  }
};

// Get image from FileSystem
export const getImageFromFileSystem = async (key) => {
  try {
    const fileUri = await getFromAsyncStorage(key);
    if (fileUri) {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        return fileUri;
      } else {
        await clearFromAsyncStorage(key);
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting image from FileSystem:", error);
    return null;
  }
};

// Cleanup FileSystem cache based on LRU strategy
export const cleanupFileSystemCache = async (maxStorageMb = 100) => {
  try {
    const files = await FileSystem.readDirectoryAsync(
      FileSystem.cacheDirectory
    );
    let totalSize = 0;
    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const fileUri = `${FileSystem.cacheDirectory}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        totalSize += fileInfo.size / (1024 * 1024); // Convert to MB
        return {
          fileUri,
          size: fileInfo.size,
          modifiedTime: fileInfo.modificationTime,
        };
      })
    );

    if (totalSize > maxStorageMb) {
      fileDetails.sort((a, b) => a.modifiedTime - b.modifiedTime); // Sort by oldest first
      let sizeToFree = totalSize - maxStorageMb;
      for (const file of fileDetails) {
        if (sizeToFree <= 0) break;
        await FileSystem.deleteAsync(file.fileUri);
        sizeToFree -= file.size / (1024 * 1024);
      }
    }
  } catch (error) {
    console.error("Error cleaning up FileSystem cache:", error);
  }
};

// Fetch or cache image URI
export const fetchCachedImageUri = async (imageKey, fallbackUrl) => {
  try {
    const cachedUri = await getImageFromFileSystem(imageKey);
    console.log(`FETCHED CACHE IMAGE URI: ${cachedUri}`);

    return cachedUri || fallbackUrl;
  } catch (error) {
    console.error("Error fetching cached image:", error);
    return `${BASE_URL}${fallbackUrl}`;
  }
};

// Clear all FileSystem cache from both cacheDirectory and documentDirectory
export const clearAllFileSystemCache = async () => {
  try {
    // Clear cacheDirectory
    const cacheFiles = await FileSystem.readDirectoryAsync(
      FileSystem.cacheDirectory
    );
    await Promise.all(
      cacheFiles.map(async (file) => {
        const fileUri = `${FileSystem.cacheDirectory}${file}`;
        await FileSystem.deleteAsync(fileUri);
      })
    );

    // Clear documentDirectory
    const documentFiles = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory
    );
    await Promise.all(
      documentFiles.map(async (file) => {
        const fileUri = `${FileSystem.documentDirectory}${file}`;
        await FileSystem.deleteAsync(fileUri);
      })
    );

    console.log(
      "All FileSystem cache cleared from both cacheDirectory and documentDirectory."
    );
  } catch (error) {
    console.error("Error clearing FileSystem cache:", error);
  }
};

// ========================
// Combined Cache Utilities
// ========================

// Clear expired data from both cacheStore, AsyncStorage, and FileSystem
export const clearExpiredCache = async () => {
  cleanupCacheStore();
  const keys = await AsyncStorage.getAllKeys();
  const now = Date.now();

  await Promise.all(
    keys.map(async (key) => {
      try {
        const jsonValue = await AsyncStorage.getItem(key);
        if (jsonValue) {
          const data = JSON.parse(jsonValue);
          if (data.expires && data.expires < now) {
            await AsyncStorage.removeItem(key);
            const fileUri = `${FileSystem.cacheDirectory}${key}`;
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (fileInfo.exists) {
              await FileSystem.deleteAsync(fileUri);
            }
          }
        }
      } catch (error) {
        console.error(`Error checking expiration for ${key}:`, error);
      }
    })
  );
};

// Reusable TTL check function
export const isTTLValid = (timestamp, ttlInMilliseconds) => {
  if (!timestamp) return false;
  return Date.now() - timestamp < ttlInMilliseconds;
};
