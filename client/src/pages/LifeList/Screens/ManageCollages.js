import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import CollageCard from "../../../components/Cards/CollageCard";
import { layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_USER_COLLAGES } from "../../../utils/queries";
import { useAuth } from "../../../contexts/AuthContext";
import { useCallbackContext } from "../../../contexts/CallbackContext"; // Import context
import Icon from "../../../components/Icons/Icon";

export default function ManageCollages() {
  const { currentUser } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { associatedCollages } = route.params;
  const { updateCollagesCallback } = useCallbackContext(); // Get the callback from context

  const { data, loading, error, refetch } = useQuery(GET_USER_COLLAGES, {
    variables: { userId: currentUser._id },
  });

  const initialCollages = associatedCollages
    ? associatedCollages.map((collage) => collage._id)
    : [];
  const [selectedCollages, setSelectedCollages] = useState(initialCollages);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setIsModified(
      selectedCollages.length !== initialCollages.length ||
        selectedCollages.some((collage) => !initialCollages.includes(collage))
    );
  }, [selectedCollages, initialCollages]);

  const handleCheckboxToggle = (collageId) => {
    setSelectedCollages((prev) => {
      const newCollages = prev.includes(collageId)
        ? prev.filter((id) => id !== collageId)
        : [...prev, collageId];
      return newCollages;
    });
  };

  const handleSave = () => {
    if (!isModified) return;
    // Map selectedCollages to the actual collage objects
    const updatedCollages = selectedCollages.map((collageId) =>
      data.getUserCollages.find((collage) => collage._id === collageId)
    );
    updateCollagesCallback(updatedCollages); // Use the callback with full collage objects
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
        title={"Manage Collages"}
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
        data={data.getUserCollages}
        renderItem={({ item }) => (
          <CollageCard
            collage={item}
            isSelected={selectedCollages.includes(item._id)}
            onCheckboxToggle={handleCheckboxToggle}
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
    borderWidth: 1,
    borderColor: "#6AB95250",
  },
  buttonTextActive: {
    color: "#6AB952",
    fontWeight: "500",
  },
});
