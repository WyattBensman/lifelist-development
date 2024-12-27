import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { BASE_URL } from "../config";

// Globals
let cacheStore = {}; // In-memory cache for temporary storage
const DOCUMENT_DIR = FileSystem.documentDirectory;
const CACHE_DIR = FileSystem.cacheDirectory;

// === Utility Functions === //

const logError = (action, error) => {
  console.error(`[cacheHelper] ${action} failed:`, error.message);
};

const logInfo = (message) => {
  console.log(`[cacheHelper] ${message}`);
};

const getFilePaths = (key, extension = "jpg") => ({
  documentPath: `${DOCUMENT_DIR}${key}.${extension}`,
  cachePath: `${CACHE_DIR}${key}.${extension}`,
});

const isFileExpired = (fileInfo, ttl) => {
  if (!ttl || !fileInfo.modificationTime) return false;
  return Date.now() > new Date(fileInfo.modificationTime).getTime() + ttl;
};

// === Metadata Helpers === //

export const saveMetadataToCache = async (
  key,
  metadata,
  isPersistent = true,
  ttl = null
) => {
  try {
    const metadataString = JSON.stringify({
      data: metadata,
      timestamp: ttl ? Date.now() : null,
      ttl,
    });

    if (isPersistent) {
      await AsyncStorage.setItem(key, metadataString);
    } else {
      cacheStore[key] = metadataString;
    }
  } catch (error) {
    logError(`Saving metadata (${key})`, error);
  }
};

export const getMetadataFromCache = async (key, isPersistent = true) => {
  try {
    const metadataString = isPersistent
      ? await AsyncStorage.getItem(key)
      : cacheStore[key];

    if (!metadataString) return null;

    const { data, timestamp, ttl } = JSON.parse(metadataString);

    if (ttl && timestamp && Date.now() > timestamp + ttl) {
      logInfo(`Metadata (${key}) expired`);
      clearMetadataCache(key, isPersistent);
      return null;
    }

    return data;
  } catch (error) {
    logError(`Fetching metadata (${key})`, error);
    return null;
  }
};

export const clearMetadataCache = async (key, isPersistent = true) => {
  try {
    if (isPersistent) {
      await AsyncStorage.removeItem(key);
    } else {
      delete cacheStore[key];
    }
  } catch (error) {
    logError(`Clearing metadata (${key})`, error);
  }
};

// === File System Helpers === //

export const saveImageToFileSystem = async (
  key,
  imagePath,
  isPersistent = false,
  ttl = null
) => {
  try {
    const fileUri = isPersistent
      ? getFilePaths(key).documentPath
      : getFilePaths(key).cachePath;

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists && !isFileExpired(fileInfo, ttl)) {
      logInfo(`Image (${key}) already exists: ${fileUri}`);
      return fileUri;
    }

    if (fileInfo.exists) await FileSystem.deleteAsync(fileUri);

    const fullImageUrl = imagePath.startsWith("http")
      ? imagePath
      : `${BASE_URL}${imagePath}`;
    const downloadedImage = await FileSystem.downloadAsync(
      fullImageUrl,
      fileUri
    );

    logInfo(`Image (${key}) saved: ${downloadedImage.uri}`);
    return downloadedImage.uri;
  } catch (error) {
    logError(`Saving image (${key})`, error);
    return null;
  }
};

export const getImageFromFileSystem = async (key, ttl = null) => {
  try {
    const { documentPath, cachePath } = getFilePaths(key);

    for (const path of [documentPath, cachePath]) {
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (fileInfo.exists && !isFileExpired(fileInfo, ttl)) {
        return path;
      }
    }

    return null;
  } catch (error) {
    logError(`Fetching image (${key})`, error);
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
        logInfo(`Image (${key}) deleted: ${path}`);
        return true;
      }
    }

    logInfo(`No image found for deletion (${key})`);
    return false;
  } catch (error) {
    logError(`Deleting image (${key})`, error);
    return false;
  }
};

export const fetchCachedImageUri = async (key, fallbackUri) => {
  try {
    const cachedUri = await getImageFromFileSystem(key);

    if (cachedUri) {
      return cachedUri;
    }

    // If no cached file, save the fallbackUri to cache
    const downloadedUri = await saveImageToFileSystem(key, fallbackUri);
    return downloadedUri || fallbackUri;
  } catch (error) {
    logError(`Fetching or saving image (${key})`, error);
    return fallbackUri;
  }
};
