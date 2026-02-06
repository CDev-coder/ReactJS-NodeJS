// Local storage utilities
export const storage = {
  // Get item from localStorage
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  },

  // Set item in localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error writing to localStorage:", error);
      return false;
    }
  },

  // Remove item from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  },

  // Clear all items from localStorage
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  },
};

// Task-specific storage functions
export const taskStorage = {
  // Save tasks to localStorage
  saveTasks: (tasks) => {
    return storage.set("tasks", tasks);
  },

  // Load tasks from localStorage
  loadTasks: () => {
    return storage.get("tasks", []);
  },

  // Clear all tasks from localStorage
  clearTasks: () => {
    return storage.remove("tasks");
  },
};

// Auth storage functions
export const authStorage = {
  saveToken: (token) => storage.set("token", token),
  getToken: () => storage.get("token"),
  removeToken: () => storage.remove("token"),
  saveUser: (user) => storage.set("user", user),
  getUser: () => storage.get("user"),
  removeUser: () => storage.remove("user"),
  clearAuth: () => {
    storage.remove("token");
    storage.remove("user");
  },
};
