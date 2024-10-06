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
        const userData = await AuthService.getUser();
        // Fetch user details if logged in
        setCurrentUser(userData);
      }

      // Check registration status
      const progress = await AuthService.getRegistrationProgress();
      setRegistrationProgress(progress || "initial");

      // Check if registration is complete
      const isComplete = await AuthService.isRegistrationComplete();
      setRegistrationComplete(isComplete);
    };

    checkAuthStatus();
  }, []);

  const login = async (token) => {
    console.log("Login started");
    await AuthService.saveToken(token); // Save the token

    console.log("Token storage complete, setting isAuthenticated");
    setIsAuthenticated(true);

    const userData = await AuthService.getUser();
    setCurrentUser(userData);

    // Mark registration as complete
    await AuthService.setRegistrationComplete();
    setRegistrationComplete(true);
  };

  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setRegistrationProgress(""); // Reset registration progress if applicable
    setRegistrationComplete(false); // Reset registrationComplete

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
