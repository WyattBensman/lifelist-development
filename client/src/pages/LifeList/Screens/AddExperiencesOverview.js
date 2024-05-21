import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation, useQuery } from "@apollo/client";
import { headerStyles, layoutStyles } from "../../../styles";
import SymbolButtonSm from "../../../icons/SymbolButtonSm";
import AddExperienceCard from "../Cards/AddExperienceCard";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useAuth } from "../../../contexts/AuthContext";
import { ADD_EXPERIENCE_TO_LIFELIST } from "../../../utils/mutations";
import { GET_USER_PROFILE } from "../../../utils/queries/userQueries";
import { useCallbackContext } from "../../../contexts/CallbackContext";

export default function AddExperiencesOverview() {
  const { currentUser, updateCurrentUser } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { addedExperiences, lifeListId } = route.params;
  const [experiences, setExperiences] = useState(addedExperiences);
  const [addExperienceToLifeList] = useMutation(ADD_EXPERIENCE_TO_LIFELIST);

  const { refetch: refetchUserProfile } = useQuery(GET_USER_PROFILE, {
    variables: { userId: currentUser._id },
    skip: true,
  });

  const { setUpdateShotsCallback, setUpdateCollagesCallback } =
    useCallbackContext();

  // Check if all experiences have a list selected
  const allExperiencesHaveList = experiences.every(
    (experience) => experience.list !== null
  );

  const handleAddExperiences = async () => {
    try {
      // Iterate over each experience and add them to the LifeList
      for (const exp of experiences) {
        const response = await addExperienceToLifeList({
          variables: {
            lifeListId: lifeListId,
            experienceId: exp.experience._id,
            list: exp.list,
            associatedShots: exp.associatedShots.map((shot) => shot._id),
            associatedCollages: exp.associatedCollages.map(
              (collage) => collage._id
            ),
          },
        });

        if (!response.data.addExperienceToLifeList.success) {
          console.error(
            "Failed to add experience:",
            response.data.addExperienceToLifeList.message
          );
          return; // Stop the process if any experience fails to be added
        }
      }

      const updatedUser = await refetchUserProfile(); // Fetch updated user data
      updateCurrentUser(updatedUser.data.getUserProfileById); // Update current user in AuthContext
      navigation.navigate("LifeList");
    } catch (error) {
      console.error("Error adding experiences:", error);
    }
  };

  const handleUpdateListStatus = (experienceId, newListStatus) => {
    setExperiences((prevExperiences) =>
      prevExperiences.map((exp) =>
        exp.experience._id === experienceId
          ? { ...exp, list: newListStatus }
          : exp
      )
    );
  };

  const handleUpdateShots = (experienceId, newShots) => {
    setExperiences((prevExperiences) =>
      prevExperiences.map((exp) =>
        exp.experience._id === experienceId
          ? { ...exp, associatedShots: newShots }
          : exp
      )
    );
  };

  const handleUpdateCollages = (experienceId, newCollages) => {
    setExperiences((prevExperiences) =>
      prevExperiences.map((exp) =>
        exp.experience._id === experienceId
          ? { ...exp, associatedCollages: newCollages }
          : exp
      )
    );
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <SymbolButtonSm
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={{ height: 18, width: 18 }}
          />
        }
        button1={
          <Text
            style={[
              styles.addButton,
              allExperiencesHaveList && styles.addButtonActive,
            ]}
            onPress={allExperiencesHaveList ? handleAddExperiences : null}
          >
            Add Experiences
          </Text>
        }
      />
      <View style={layoutStyles.contentContainer}>
        <Text style={[headerStyles.headerHeavy, layoutStyles.marginBtmSm]}>
          New Experiences
        </Text>
        <FlatList
          data={experiences}
          renderItem={({ item }) => (
            <AddExperienceCard
              experience={item}
              onListSelect={handleUpdateListStatus}
              onUpdateShots={(expId, shots) => {
                setUpdateShotsCallback(
                  () => (newShots) => handleUpdateShots(expId, newShots)
                );
                navigation.navigate("ManageShots", {
                  experienceId: expId,
                  associatedShots: shots,
                });
              }}
              onUpdateCollages={(expId, collages) => {
                setUpdateCollagesCallback(
                  () => (newCollages) =>
                    handleUpdateCollages(expId, newCollages)
                );
                navigation.navigate("ManageCollages", {
                  experienceId: expId,
                  associatedCollages: collages,
                });
              }}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    color: "#d4d4d4",
  },
  addButtonActive: {
    color: "#6AB952",
  },
});
