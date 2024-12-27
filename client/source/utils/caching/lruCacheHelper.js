class LRUCache {
  constructor(capacity) {
    this.capacity = capacity; // Maximum number of items
    this.cache = new Map(); // Stores key-value pairs
  }

  // === Retrieve an Item === //
  get(key) {
    if (!this.cache.has(key)) return null;

    // Mark as recently used
    const value = this.cache.get(key);
    this.cache.delete(key); // Remove the key from its current position
    this.cache.set(key, value); // Reinsert to mark as most recently used
    return value;
  }

  // === Add or Update an Item === //
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key); // Remove existing entry
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used item (first in Map)
      const lruKey = this.cache.keys().next().value; // Get the first key
      this.cache.delete(lruKey);
    }

    this.cache.set(key, value); // Add new entry
  }

  // === Check Existence === //
  has(key) {
    return this.cache.has(key);
  }
}

export default LRUCache;
