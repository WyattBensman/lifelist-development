import AsyncStorage from "@react-native-async-storage/async-storage";

let cacheStore = {};

// =====================
// Cache Store (Temporary)
// =====================

// Save data to cache (with TTL)
export const saveToCacheStore = (key, value, ttlInSeconds) => {
  const expires = Date.now() + ttlInSeconds * 1000;
  cacheStore[key] = { value, expires };
};

// Get data from cache
export const getFromCacheStore = (key) => {
  const cacheEntry = cacheStore[key];
  if (!cacheEntry) return null;

  if (Date.now() > cacheEntry.expires) {
    // Cache has expired, remove it
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

// ========================
// AsyncStorage (Persistent)
// ========================

// Save data to AsyncStorage
export const saveToAsyncStorage = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error("Error saving to AsyncStorage:", error);
  }
};

// Get data from AsyncStorage
export const getFromAsyncStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
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
