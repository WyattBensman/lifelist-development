// Import necessary modules and themes
import React, { createContext, useContext, useState, useEffect } from "react";
import lightTheme from "../themes/lightTheme";
import darkTheme from "../themes/darkTheme";

// Create ThemeContext
const ThemeContext = createContext();

// Utility function to detect system theme
const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

// ThemeProvider Component
export const ThemeProvider = ({ children }) => {
  // State for theme and theme object
  const [theme, setTheme] = useState(getSystemTheme);
  const [themeObject, setThemeObject] = useState(
    getSystemTheme() === "dark" ? darkTheme : lightTheme
  );

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setThemeObject(newTheme === "dark" ? darkTheme : lightTheme);
  };

  // Effect to update theme based on system preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      setTheme(systemTheme);
      setThemeObject(systemTheme === "dark" ? darkTheme : lightTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, themeObject, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);
z;
