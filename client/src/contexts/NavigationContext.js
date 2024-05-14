import { createContext, useContext, useState } from "react";

const NavigationContext = createContext();

export function useNavigationContext() {
  return useContext(NavigationContext);
}

export const NavigationProvider = ({ children }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  return (
    <NavigationContext.Provider value={{ isTabBarVisible, setIsTabBarVisible }}>
      {children}
    </NavigationContext.Provider>
  );
};
