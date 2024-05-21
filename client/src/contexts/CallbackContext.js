import React, { createContext, useContext, useState } from "react";

const CallbackContext = createContext();

export const CallbackProvider = ({ children }) => {
  const [updateShotsCallback, setUpdateShotsCallback] = useState(null);
  const [updateCollagesCallback, setUpdateCollagesCallback] = useState(null);

  return (
    <CallbackContext.Provider
      value={{
        updateShotsCallback,
        setUpdateShotsCallback,
        updateCollagesCallback,
        setUpdateCollagesCallback,
      }}
    >
      {children}
    </CallbackContext.Provider>
  );
};

export const useCallbackContext = () => useContext(CallbackContext);
