import React, { createContext, useState, useContext } from "react";
import { useAdminLifeList } from "./AdminLifeListContext";

// AddExperiencesContext definition
const AddExperiencesContext = createContext();

// AddExperiencesProvider Component
export const AddExperiencesProvider = ({ children }) => {
  const { addLifeListExperienceToCache } = useAdminLifeList();

  const initialLifeListExperience = {
    experience: null, // Stores experience details (e.g., id, name, etc.)
    list: null, // Associated list (e.g., user-generated or predefined)
    associatedShots: [], // List of associated shots or media
    year: null, // Year of the experience
    venue: null, // Venue details
    performers: [], // Array of performers involved
    opponent: null, // Opponent information, if applicable
    score: {}, // Scoring details
  };

  const [lifeListExperiences, setLifeListExperiences] = useState([]);
  const [hasModified, setHasModified] = useState(false); // Tracks if any modification occurred

  // Add a new LifeListExperience
  const addLifeListExperience = (experience) => {
    const newLifeListExperience = { ...initialLifeListExperience, experience };
    setLifeListExperiences((prev) => [...prev, newLifeListExperience]);
    setHasModified(true); // Mark as modified
  };

  // Update an existing LifeListExperience
  const updateLifeListExperience = (experienceId, updates) => {
    setLifeListExperiences((prev) =>
      prev.map((lifeListExp) =>
        lifeListExp.experience?._id === experienceId
          ? { ...lifeListExp, ...updates }
          : lifeListExp
      )
    );
    setHasModified(true); // Mark as modified whenever an update occurs
  };

  // Remove a LifeListExperience
  const removeLifeListExperience = (experienceId) => {
    const updatedExperiences = lifeListExperiences.filter(
      (lifeListExp) => lifeListExp.experience?._id !== experienceId
    );
    setLifeListExperiences(updatedExperiences);

    // Reset modification flag if all experiences are removed
    if (updatedExperiences.length === 0) {
      setHasModified(false);
    }
  };

  const commitLifeListExperiences = async () => {
    try {
      for (const experience of lifeListExperiences) {
        // Commit each experience to AdminLifeListContext
        await addLifeListExperienceToCache(experience);
      }
      resetLifeListExperiences(); // Reset the AddExperiencesContext state
    } catch (error) {
      console.error(
        "Error committing experiences to AdminLifeListContext:",
        error
      );
    }
  };

  // Reset all LifeListExperiences
  const resetLifeListExperiences = () => {
    setLifeListExperiences([]);
    setHasModified(false); // Reset modification flag
  };

  return (
    <AddExperiencesContext.Provider
      value={{
        lifeListExperiences,
        addLifeListExperience,
        updateLifeListExperience,
        removeLifeListExperience,
        resetLifeListExperiences,
        commitLifeListExperiences,
        hasModified,
      }}
    >
      {children}
    </AddExperiencesContext.Provider>
  );
};

// Custom hook to access LifeListExperienceContext
export const useAddExperiencesContext = () => useContext(AddExperiencesContext);
