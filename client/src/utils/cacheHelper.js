let cacheStore = {};

// Save data to cache
export const setCache = (key, value, ttlInSeconds) => {
  const expires = Date.now() + ttlInSeconds * 1000;
  cacheStore[key] = { value, expires };
};

// Get data from cache
export const getCache = (key) => {
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
export const clearCache = (key) => {
  delete cacheStore[key];
};

// Clear all caches
export const clearAllCaches = () => {
  cacheStore = {};
};
