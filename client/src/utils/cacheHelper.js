import AsyncStorage from "@react-native-async-storage/async-storage";

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
    delete cacheStore[key]; // Remove expired data
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
      // Data has expired, clear it from storage
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
  // Cleanup cacheStore
  cleanupCacheStore();

  // Cleanup AsyncStorage expired items
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
  if (!timestamp) return false; // If no timestamp is provided, TTL is invalid
  return Date.now() - timestamp < ttlInMilliseconds;
};
