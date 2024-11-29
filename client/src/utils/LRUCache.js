class LRUCache {
  constructor(capacity) {
    this.capacity = capacity; // Maximum number of items
    this.cache = new Map(); // Stores key-value pairs
  }

  // Get an item from the cache
  get(key) {
    if (!this.cache.has(key)) return null;

    // Mark as recently used
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value); // Move to the end (most recently used)
    return value;
  }

  // Add an item to the cache
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key); // Remove the old entry
    } else if (this.cache.size >= this.capacity) {
      // Evict the least recently used item (first item in Map)
      const lruKey = this.cache.keys().next().value; // Get the first key
      this.cache.delete(lruKey);
    }

    this.cache.set(key, value); // Add new entry
  }

  // Check if an item exists in the cache
  has(key) {
    return this.cache.has(key);
  }
}

export default LRUCache;
