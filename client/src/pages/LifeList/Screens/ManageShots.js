import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import ShotCard from "../../../components/Cards/ShotCard";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries";
import { UPDATE_ASSOCIATED_SHOTS } from "../../../utils/mutations";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import Icon from "../../../components/Icons/Icon";

export default function ManageShots() {
  const route = useRoute();
  const navigation = useNavigation();
  const { experienceId, associatedShots } = route.params;
  const { data, loading, error, refetch } = useQuery(GET_ALL_CAMERA_SHOTS);
  const [updateShots] = useMutation(UPDATE_ASSOCIATED_SHOTS);

  const [selectedShots, setSelectedShots] = useState([]);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (associatedShots) {
      setSelectedShots(associatedShots.map((shotInfo) => shotInfo.shot));
    }
  }, [associatedShots]);

  useEffect(() => {
    setIsModified(
      selectedShots.length !== associatedShots.length ||
        selectedShots.some(
          (shot) =>
            !associatedShots.some(
              (initialShot) => initialShot.shot._id === shot._id
            )
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

  const handleSave = async () => {
    if (!isModified) return;
    try {
      await updateShots({
        variables: {
          lifeListExperienceId: experienceId,
          shotIds: selectedShots.map((shot) => shot._id),
        },
      });
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update associated shots:", error);
    }
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
        title={"Manage Shots"}
        button1={
          <Pressable
            onPress={handleSave}
            style={[
              styles.buttonContainer,
              isModified && styles.buttonContainerActive,
            ]}
          >
            <Text
              style={[styles.buttonText, isModified && styles.buttonTextActive]}
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
      />
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
  buttonText: {
    color: "#696969",
  },
  buttonContainerActive: {
    backgroundColor: "#6AB95230",
    fontWeight: "500",
  },
  buttonTextActive: {
    color: "#6AB952",
  },
});
