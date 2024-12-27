import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../utils/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create AuthContext
const AuthContext = createContext({});

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check initial authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      const isLoggedIn = await AuthService.loggedIn();
      setIsAuthenticated(isLoggedIn);

      if (isLoggedIn) {
        const userData = await AuthService.getUser();
        setCurrentUser(userData);
      }
    };

    checkAuthStatus();
  }, []);

  // Login method
  const login = async (token) => {
    try {
      await AuthService.saveToken(token);
      const userData = await AuthService.getUser();
      setCurrentUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // Logout method
  const logout = async () => {
    try {
      // Preserve early access values
      const earlyAccessCode = await AsyncStorage.getItem("earlyAccessCode");
      const isEarlyAccessUnlocked = await AsyncStorage.getItem(
        "isEarlyAccessUnlocked"
      );

      await AuthService.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);

      // Clear AsyncStorage and restore early access values
      await AsyncStorage.clear();
      if (earlyAccessCode)
        await AsyncStorage.setItem("earlyAccessCode", earlyAccessCode);
      if (isEarlyAccessUnlocked)
        await AsyncStorage.setItem(
          "isEarlyAccessUnlocked",
          isEarlyAccessUnlocked
        );
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
