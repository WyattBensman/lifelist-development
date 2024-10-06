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
  const [registrationProgress, setRegistrationProgress] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isLoggedIn = await AuthService.loggedIn();
      setIsAuthenticated(isLoggedIn);

      if (isLoggedIn) {
        const userData = await AuthService.getUser(); // Fetch user details if logged in
        setCurrentUser(userData);
      }

      const progress = await AuthService.getRegistrationProgress();
      setRegistrationProgress(progress || "initial");
    };

    checkAuthStatus();
  }, []);

  const login = async (token) => {
    console.log("Login started");
    console.log(token);

    await AuthService.saveToken(token); // Wait for the token to be saved

    console.log("Token storage complete, setting isAuthenticated");
    setIsAuthenticated(true);

    const userData = await AuthService.getUser();
    setCurrentUser(userData); // Update user details in context
  };

  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null); // Clear user details on logout
    setRegistrationProgress(""); // Reset registration progress if applicable

    // Reset navigation state to ensure user can't go back
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Authentication", params: { screen: "Login" } }],
      })
    );
  };

  const updateCurrentUser = (updatedFields) => {
    console.log("Updating Current User....");
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
        registrationProgress,
        setRegistrationProgress,
        registrationComplete,
        setRegistrationComplete,
        navigationRef,
        currentUser,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
