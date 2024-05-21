import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import ShotCard from "../../../components/Cards/ShotCard";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries";
import { UPDATE_ASSOCIATED_SHOTS } from "../../../utils/mutations";
import { layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";

export default function UpdateShots() {
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

  const handleCheckboxToggle = (shot) => {
    setSelectedShots((prev) => {
      const isAlreadySelected = prev.some((s) => s._id === shot._id);
      const newShots = isAlreadySelected
        ? prev.filter((s) => s._id !== shot._id)
        : [...prev, shot];
      setIsModified(true);
      return newShots;
    });
  };

  const handleSave = async () => {
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
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Update Shots"}
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

/* useEffect(() => {
  setIsModified(
    selectedShots.length !== initialShots.length ||
      selectedShots.some(
        (shot) =>
          !initialShots.some((initialShot) => initialShot._id === shot._id)
      )
  );
}, [selectedShots, initialShots]); */
