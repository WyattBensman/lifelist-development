import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useMutation, useQuery } from "@apollo/client";
import { iconStyles, layoutStyles } from "../../../styles";
import AddExperienceCard from "../Cards/AddExperienceCard";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useAuth } from "../../../contexts/AuthContext";
import { ADD_EXPERIENCE_TO_LIFELIST } from "../../../utils/mutations";
import { GET_USER_PROFILE } from "../../../utils/queries/userQueries";
import { useCallbackContext } from "../../../contexts/CallbackContext";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";

export default function AddExperiencesOverview() {
  const { currentUser, updateCurrentUser } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { addedExperiences, lifeListId } = route.params;
  const [experiences, setExperiences] = useState(addedExperiences);
  const [addExperienceToLifeList] = useMutation(ADD_EXPERIENCE_TO_LIFELIST);
  const { setIsTabBarVisible } = useNavigationContext();

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  const { refetch: refetchUserProfile } = useQuery(GET_USER_PROFILE, {
    variables: { userId: currentUser._id },
    skip: true,
  });

  const { setUpdateShotsCallback, setUpdateCollagesCallback } =
    useCallbackContext();

  const allExperiencesHaveList = experiences.every(
    (experience) => experience.list !== null
  );

  const handleAddExperiences = async () => {
    if (!allExperiencesHaveList) return;

    try {
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
          return;
        }
      }

      const updatedUser = await refetchUserProfile();
      updateCurrentUser(updatedUser.data.getUserProfileById);
      navigation.navigate("AdminLifeList");
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

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        title={"New Experiences"}
        button1={
          <View
            style={[
              styles.buttonContainer,
              allExperiencesHaveList && styles.addButtonActiveContainer,
            ]}
          >
            <Text
              style={[
                styles.addButton,
                allExperiencesHaveList && styles.addButtonActive,
              ]}
              onPress={handleAddExperiences}
            >
              Add
            </Text>
          </View>
        }
      />
      <ScrollView style={{ marginTop: 8, flex: 1 }}>
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
                navigation.navigate("ManageTempShots", {
                  experienceId: expId,
                  associatedShots: shots,
                  onUpdateShots: handleUpdateShots,
                });
              }}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#1C1C1C",
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 12,
  },
  addButton: {
    color: "#696969",
  },
  addButtonActiveContainer: {
    backgroundColor: "#6AB95230",
  },
  addButtonActive: {
    color: "#6AB952",
    fontWeight: "500",
  },
});
