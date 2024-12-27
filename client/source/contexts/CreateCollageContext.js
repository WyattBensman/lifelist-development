import React, { createContext, useState, useContext } from "react";
import { useAdminProfile } from "./AdminProfileContext"; // Import AdminProfileContext

// CreateCollageContext definition
const CreateCollageContext = createContext();

// CreateCollageProvider Component
export const CreateCollageProvider = ({ children }) => {
  const initialCollageState = {
    _id: null, // Unique identifier for the collage (used for editing)
    images: [], // List of selected images
    coverImage: null, // Cover image for the collage
    caption: "", // Collage caption
    locations: [], // Array of location information (e.g., name, coordinates)
    taggedUsers: [], // Array of tagged users' IDs
    privacy: "PUBLIC", // Privacy setting, default is PUBLIC
    privacyGroup: null, // Reference to a privacy group
  };

  const [collage, setCollage] = useState(initialCollageState);
  const [hasModified, setHasModified] = useState(false); // Tracks if collage is modified

  const { addCollage } = useAdminProfile(); // Access AdminProfileContext

  // Function to update the collage state
  const updateCollage = (updates) => {
    setCollage((prev) => ({ ...prev, ...updates }));
    setHasModified(true); // Mark the collage as modified
  };

  // Function to reset the collage to its initial state
  const resetCollage = () => {
    setCollage(initialCollageState);
    setHasModified(false); // Reset modification tracker
  };

  // Function to commit the collage to AdminProfileContext
  const commitCollage = async () => {
    try {
      if (!collage.coverImage || collage.images.length === 0) {
        throw new Error(
          "Collage must have a cover image and at least one image."
        );
      }

      // Push the collage to AdminProfileContext
      await addCollage(collage);

      // Reset the collage state after successful commit
      resetCollage();
      console.log("[CreateCollageContext] Collage committed successfully.");
    } catch (error) {
      console.error("[CreateCollageContext] Error committing collage:", error);
    }
  };

  return (
    <CreateCollageContext.Provider
      value={{
        collage,
        updateCollage,
        resetCollage,
        commitCollage,
        hasModified,
      }}
    >
      {children}
    </CreateCollageContext.Provider>
  );
};

// Custom hook to access the CreateCollageContext
export const useCreateCollageContext = () => useContext(CreateCollageContext);
