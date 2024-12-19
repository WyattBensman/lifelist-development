import { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../utils/AuthService";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AuthService.getUser();
      setUser(userData);
    };

    loadUser();
  }, []);

  const resetUserState = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, resetUserState }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
