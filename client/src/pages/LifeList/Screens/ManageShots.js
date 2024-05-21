import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useQuery } from "@apollo/client";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import ShotCard from "../../../components/Cards/ShotCard";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries";
import { layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useCallbackContext } from "../../../contexts/CallbackContext";

export default function ManageShots() {
  const route = useRoute();
  const navigation = useNavigation();
  const { associatedShots } = route.params;
  const { updateShotsCallback } = useCallbackContext();
  const { data, loading, error, refetch } = useQuery(GET_ALL_CAMERA_SHOTS);

  const initialShots = associatedShots || [];
  const [selectedShots, setSelectedShots] = useState(initialShots);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setIsModified(
      selectedShots.length !== initialShots.length ||
        selectedShots.some(
          (shot) =>
            !initialShots.some((initialShot) => initialShot._id === shot._id)
        )
    );
  }, [selectedShots, initialShots]);

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
    updateShotsCallback(selectedShots);
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
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Manage Shots"}
        button1={
          <Pressable onPress={handleSave}>
            <Text style={{ color: isModified ? "green" : "#d4d4d4" }}>
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
