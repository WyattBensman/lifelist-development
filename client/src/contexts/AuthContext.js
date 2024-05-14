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

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isLoggedIn = await AuthService.loggedIn();
      setIsAuthenticated(isLoggedIn);

      const progress = await AuthService.getRegistrationProgress();
      setRegistrationProgress(progress || "initial");
    };

    checkAuthStatus();
  }, []);

  const login = async (token) => {
    await AuthService.saveToken(token);
    setIsAuthenticated(true);
    // Optional: set registration progress if needed
  };

  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setRegistrationProgress(""); // Reset registration progress if applicable

    // Reset navigation state to ensure user can't go back
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Authentication", params: { screen: "Login" } }],
      })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        logout,
        registrationProgress,
        setRegistrationProgress,
        registrationComplete,
        setRegistrationComplete,
        navigationRef,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
