import React, { createContext, useState, useContext } from "react";

const LifeListExperienceContext = createContext();

export const LifeListExperienceProvider = ({ children }) => {
  const [lifeListExperiences, setLifeListExperiences] = useState([]);
  const [hasModified, setHasModified] = useState(false); // Track if any experience was modified

  // Add a new LifeListExperience for a specific experience
  const addLifeListExperience = (experience) => {
    const newLifeListExperience = {
      experience,
      list: null,
      associatedShots: [],
      year: null,
      venue: null,
      performers: [],
      opponent: null,
      score: {},
    };
    setLifeListExperiences((prev) => [...prev, newLifeListExperience]);
  };

  // Update a LifeListExperience with updates like shots, list, collages, etc.
  const updateLifeListExperience = (experienceId, updates) => {
    setLifeListExperiences((prev) =>
      prev.map((lifeListExp) =>
        lifeListExp.experience._id === experienceId
          ? { ...lifeListExp, ...updates }
          : lifeListExp
      )
    );
    setHasModified(true); // Mark as modified whenever any field is updated
  };

  // Remove a LifeListExperience from the list
  const removeLifeListExperience = (experienceId) => {
    const updatedExperiences = lifeListExperiences.filter(
      (lifeListExp) => lifeListExp.experience._id !== experienceId
    );

    setLifeListExperiences(updatedExperiences);

    // Reset the modification flag if all experiences are removed
    if (updatedExperiences.length === 0) {
      setHasModified(false);
    }
  };

  // Reset all LifeListExperiences and modifications
  const resetLifeListExperiences = () => {
    setLifeListExperiences([]);
    setHasModified(false); // Reset modification flag
  };

  return (
    <LifeListExperienceContext.Provider
      value={{
        lifeListExperiences,
        addLifeListExperience,
        updateLifeListExperience,
        removeLifeListExperience,
        resetLifeListExperiences,
        hasModified,
      }}
    >
      {children}
    </LifeListExperienceContext.Provider>
  );
};

export const useLifeListExperienceContext = () =>
  useContext(LifeListExperienceContext);
