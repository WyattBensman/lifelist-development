import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import ShotCard from "../../../components/Cards/ShotCard";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useLifeListExperienceContext } from "../../../contexts/LifeListExperienceContext"; // Import LifeListExperienceContext

export default function ManageTempShots() {
  const route = useRoute();
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const { experienceId } = route.params; // Use experienceId from route params

  const { data, loading, error, refetch } = useQuery(GET_ALL_CAMERA_SHOTS);

  const { lifeListExperiences, updateLifeListExperience } =
    useLifeListExperienceContext(); // Use LifeListExperienceContext

  // Find the associated shots for this experience
  const associatedShots =
    lifeListExperiences.find((exp) => exp.experience._id === experienceId)
      ?.associatedShots || [];

  const [selectedShots, setSelectedShots] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [title, setTitle] = useState("Manage Shots");

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  useEffect(() => {
    if (associatedShots) {
      setSelectedShots([...associatedShots]);
      setTitle(associatedShots.length === 0 ? "Add Shots" : "Manage Shots");
    }
  }, [associatedShots]);

  useEffect(() => {
    setIsModified(
      selectedShots.length !== associatedShots.length ||
        selectedShots.some(
          (shot) =>
            !associatedShots.some((initialShot) => initialShot._id === shot._id)
        )
    );
  }, [selectedShots, associatedShots]);

  const handleCheckboxToggle = (shot) => {
    setSelectedShots((prev) => {
      const isAlreadySelected = prev.some((s) => s._id === shot._id);
      const newShots = isAlreadySelected
        ? prev.filter((s) => s._id !== shot._id)
        : [...prev, shot];
      return newShots;
    });
  };

  const handleSave = () => {
    if (!isModified) return;

    // Update the LifeListExperience with the new shots
    updateLifeListExperience(experienceId, {
      associatedShots: selectedShots,
    });

    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

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
        title={title}
        button1={
          <Pressable
            onPress={handleSave}
            disabled={!isModified} // Disable button if no changes
          >
            <Text
              style={[
                styles.buttonText,
                isModified && styles.buttonTextActive, // Apply active styles only if modified
              ]}
            >
              Save
            </Text>
          </Pressable>
        }
      />
      <FlatList
        data={data.getAllCameraShots}
        renderItem={({ item }) => (
          <ShotCard
            shot={item}
            isSelected={selectedShots.some((s) => s._id === item._id)}
            onCheckboxToggle={() => handleCheckboxToggle(item)}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item._id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 12,
    color: "#696969", // Inactive color
    fontWeight: "600",
  },
  buttonTextActive: {
    color: "#6AB952", // Active color
    fontWeight: "600",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginHorizontal: 0, // Ensures no margin on the outside
  },
});
