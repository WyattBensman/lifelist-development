import React, { createContext, useState, useContext } from "react";

// CollageContext definition
const CollageContext = createContext();

// CollageProvider to wrap the components where collage creation happens
export const CollageProvider = ({ children }) => {
  const [collage, setCollage] = useState({
    images: [], // Holds the selected images
    coverImage: null, // Set the cover image, can default to the first image
    caption: "", // Collage caption
    locations: [], // Holds location info (name, coordinates)
    taggedUsers: [], // Holds tagged users' IDs
    privacy: "PUBLIC", // Default privacy setting
    privacyGroup: null, // Privacy group reference
  });

  const [hasModified, setHasModified] = useState(false); // Track if the collage was modified

  // General function to update the collage object
  const updateCollage = (updates) => {
    setCollage((prev) => ({ ...prev, ...updates }));
    setHasModified(true);
  };

  // Reset the collage
  const resetCollage = () => {
    setCollage({
      images: [],
      coverImage: null,
      caption: "",
      locations: [],
      taggedUsers: [],
      privacy: "PUBLIC",
      privacyGroup: null,
    });
    setHasModified(false);
  };

  return (
    <CollageContext.Provider
      value={{
        collage,
        updateCollage,
        resetCollage,
        hasModified,
      }}
    >
      {children}
    </CollageContext.Provider>
  );
};

// Custom hook to access the collage context
export const useCollageContext = () => useContext(CollageContext);
