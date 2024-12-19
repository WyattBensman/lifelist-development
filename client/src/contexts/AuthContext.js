import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../utils/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({});

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

  const login = async (token) => {
    try {
      await AuthService.saveToken(token);
      const userData = await AuthService.getUser();
      setCurrentUser(userData);
      setIsAuthenticated(true); // State change triggers navigation
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    try {
      // Retain early access values
      const earlyAccessCode = await AsyncStorage.getItem("earlyAccessCode");
      const isEarlyAccessUnlocked = await AsyncStorage.getItem(
        "isEarlyAccessUnlocked"
      );

      await AuthService.logout();
      setIsAuthenticated(false); // State change triggers navigation
      setCurrentUser(null);

      // Clear AsyncStorage
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

  const updateCurrentUser = (updatedFields) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      ...updatedFields,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
