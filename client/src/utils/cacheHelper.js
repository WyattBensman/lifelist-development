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
