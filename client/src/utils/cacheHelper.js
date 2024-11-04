import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { BASE_URL } from "./config";

let cacheStore = {};

// =====================
// Cache Store (Temporary)
// =====================

// Save data to cache with TTL
export const saveToCacheStore = (key, value, ttlInSeconds) => {
  const expires = Date.now() + ttlInSeconds * 1000;
  cacheStore[key] = { value, expires };
};

// Get data from cache with expiration check
export const getFromCacheStore = (key) => {
  const cacheEntry = cacheStore[key];
  if (!cacheEntry) return null;

  if (Date.now() > cacheEntry.expires) {
    delete cacheStore[key];
    return null;
  }

  return cacheEntry.value;
};

// Clear specific cache
export const clearFromCacheStore = (key) => {
  delete cacheStore[key];
};

// Clear all caches
export const clearAllCacheStore = () => {
  cacheStore = {};
};

// Optional: Cleanup expired items in cacheStore on an interval
export const cleanupCacheStore = () => {
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
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

// ========================
// File System Cache (Expo)
// ========================

// Save image to FileSystem with a given key
export const saveImageToFileSystem = async (key, imagePath) => {
  try {
    // Construct the full URL using BASE_URL and the image path
    const fullImageUrl = `${BASE_URL}${imagePath}`;
    const fileUri = `${FileSystem.cacheDirectory}${key}`;

    // Download the image from the full URL
    const downloadedImage = await FileSystem.downloadAsync(
      fullImageUrl,
      fileUri
    );

    if (downloadedImage.status === 200) {
      console.log(`Image successfully downloaded and saved at: ${fileUri}`);
      // Save the local URI to AsyncStorage for caching reference
      await saveToAsyncStorage(key, fileUri, 7 * 24 * 60 * 60); // Save file URI with a 7-day TTL
    } else {
      console.error("Failed to download image:", downloadedImage);
    }
  } catch (error) {
    console.error("Error saving image to FileSystem:", error);
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

// Clear all FileSystem cache
export const clearAllFileSystemCache = async () => {
  try {
    const files = await FileSystem.readDirectoryAsync(
      FileSystem.cacheDirectory
    );
    await Promise.all(
      files.map(async (file) => {
        const fileUri = `${FileSystem.cacheDirectory}${file}`;
        await FileSystem.deleteAsync(fileUri);
      })
    );
    console.log("All FileSystem cache cleared.");
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
