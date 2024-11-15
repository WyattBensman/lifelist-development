import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import AuthService from "../utils/AuthService";
import { CommonActions } from "@react-navigation/native";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigationRef = useRef();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
    console.log("Login started");
    await AuthService.saveToken(token);
    console.log("Token storage complete, setting isAuthenticated");
    setIsAuthenticated(true);

    const userData = await AuthService.getUser();
    setCurrentUser(userData);
  };

  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);

    // Reset navigation state
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Authentication", params: { screen: "Login" } }],
      })
    );
  };

  const updateCurrentUser = (updatedFields) => {
    console.log("Updating Current User...");
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
        navigationRef,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
