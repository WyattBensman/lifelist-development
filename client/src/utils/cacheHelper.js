import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

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
// Combined Cache Utilities
// ========================

// Clear expired data from both cacheStore and AsyncStorage
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

// ========================
// Image Caching
// ========================

const IMAGE_CACHE_PREFIX = "image_cache_";
const IMAGE_DIRECTORY = FileSystem.cacheDirectory + "images/";
const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
const CACHE_EXPIRY_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

/**
 * Get the current cache size.
 * @returns {Promise<number>} - Total cache size in bytes.
 */
const getCacheSize = async () => {
  const cacheMeta =
    JSON.parse(await AsyncStorage.getItem(IMAGE_CACHE_PREFIX)) || {};
  return Object.values(cacheMeta).reduce((acc, item) => acc + item.size, 0);
};

/**
 * Clear space in the cache by deleting the least recently accessed images.
 * @param {number} requiredSpace - Space needed in bytes.
 */
const clearCacheForSpace = async (requiredSpace) => {
  const cacheMeta =
    JSON.parse(await AsyncStorage.getItem(IMAGE_CACHE_PREFIX)) || {};
  const sortedItems = Object.entries(cacheMeta).sort(
    ([, a], [, b]) => a.lastAccessed - b.lastAccessed
  );

  let freedSpace = 0;
  for (const [key, meta] of sortedItems) {
    if (freedSpace >= requiredSpace) break;

    try {
      await FileSystem.deleteAsync(meta.uri, { idempotent: true });
      freedSpace += meta.size;
      delete cacheMeta[key];
    } catch (error) {
      console.error("Failed to delete cached image:", error);
    }
  }

  await AsyncStorage.setItem(IMAGE_CACHE_PREFIX, JSON.stringify(cacheMeta));
};

/**
 * Cache an image with a storage limit and TTL for cleanup.
 * @param {string} imageUrl - The URL of the image to cache.
 * @returns {Promise<string>} - The local URI of the cached image.
 */
export const getCachedImageUri = async (imageUrl) => {
  const cacheKey = `${IMAGE_CACHE_PREFIX}${imageUrl}`;
  const cacheMeta =
    JSON.parse(await AsyncStorage.getItem(IMAGE_CACHE_PREFIX)) || {};

  if (cacheMeta[cacheKey]) {
    cacheMeta[cacheKey].lastAccessed = Date.now();
    await AsyncStorage.setItem(IMAGE_CACHE_PREFIX, JSON.stringify(cacheMeta));
    return cacheMeta[cacheKey].uri;
  }

  const currentCacheSize = await getCacheSize();
  const fileUri = `${IMAGE_DIRECTORY}${encodeURIComponent(imageUrl)}.jpg`;

  const { uri, size } = await FileSystem.downloadAsync(imageUrl, fileUri);

  if (currentCacheSize + size > MAX_CACHE_SIZE) {
    await clearCacheForSpace(currentCacheSize + size - MAX_CACHE_SIZE);
  }

  cacheMeta[cacheKey] = { uri, size, lastAccessed: Date.now() };
  await AsyncStorage.setItem(IMAGE_CACHE_PREFIX, JSON.stringify(cacheMeta));

  return uri;
};

/**
 * Cleanup expired images from cache based on a 5-day TTL.
 */
export const cleanupExpiredImages = async () => {
  const cacheMeta =
    JSON.parse(await AsyncStorage.getItem(IMAGE_CACHE_PREFIX)) || {};
  const now = Date.now();

  for (const [key, meta] of Object.entries(cacheMeta)) {
    if (now - meta.lastAccessed > CACHE_EXPIRY_MS) {
      try {
        await FileSystem.deleteAsync(meta.uri, { idempotent: true });
        delete cacheMeta[key];
      } catch (error) {
        console.error("Failed to delete expired cached image:", error);
      }
    }
  }

  await AsyncStorage.setItem(IMAGE_CACHE_PREFIX, JSON.stringify(cacheMeta));
};

// Optional: Call cleanupExpiredImages on app launch or periodically.

// ======================
// Pagination Support
// ======================

// Save paginated data to cache
export const savePaginatedToCacheStore = (
  baseKey,
  page,
  value,
  ttlInSeconds
) => {
  const key = `${baseKey}_page_${page}`;
  saveToCacheStore(key, value, ttlInSeconds);
};

// Get paginated data from cache
export const getPaginatedFromCacheStore = (baseKey, page) => {
  const key = `${baseKey}_page_${page}`;
  return getFromCacheStore(key);
};

// ========================
// LRU Cache Management
// ========================

const MAX_CACHE_ENTRIES = 50;
let cacheUsageOrder = [];

// Update cache usage order for LRU management
const updateCacheUsage = (key) => {
  // Remove key if it exists to reinsert at the end
  cacheUsageOrder = cacheUsageOrder.filter((k) => k !== key);
  cacheUsageOrder.push(key);

  // If cache exceeds max entries, remove the oldest entry
  if (cacheUsageOrder.length > MAX_CACHE_ENTRIES) {
    const oldestKey = cacheUsageOrder.shift();
    delete cacheStore[oldestKey];
  }
};

// Save data to cache with LRU tracking
export const saveToCacheStoreLRU = (key, value, ttlInSeconds) => {
  saveToCacheStore(key, value, ttlInSeconds);
  updateCacheUsage(key);
};

// Get data from cache with LRU tracking
export const getFromCacheStoreLRU = (key) => {
  const value = getFromCacheStore(key);
  if (value !== null) {
    updateCacheUsage(key);
  }
  return value;
};
