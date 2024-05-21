import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useQuery } from "@apollo/client";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import CollageCard from "../../../components/Cards/CollageCard";
import { layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { GET_USER_COLLAGES } from "../../../utils/queries";
import { useAuth } from "../../../contexts/AuthContext";
import { useCallbackContext } from "../../../contexts/CallbackContext"; // Import context

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
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Manage Collages"}
        button1={
          <Pressable onPress={handleSave}>
            <Text style={{ color: isModified ? "green" : "#d4d4d4" }}>
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
