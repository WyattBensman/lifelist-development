import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList, Pressable } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigation } from "@react-navigation/native";
import ShotCard from "../Cards/ShotCard";
import SelectedShotCard from "../Cards/SelectedShotCard";
import Icon from "../../../components/Icons/Icon";
import DraggableFlatList from "react-native-draggable-flatlist";
import MediaPlaceholder from "../Components/MediaPlaceholder";

export default function Media() {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_ALL_CAMERA_SHOTS);
  const [selectedShots, setSelectedShots] = useState([]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const handleCheckboxToggle = (shot) => {
    setSelectedShots((prevSelectedShots) => {
      if (prevSelectedShots.find((s) => s._id === shot._id)) {
        return prevSelectedShots.filter((s) => s._id !== shot._id);
      } else {
        return [...prevSelectedShots, shot];
      }
    });
  };

  const handleImagePress = (shot) => {
    setSelectedShots((prevSelectedShots) =>
      prevSelectedShots.filter((s) => s._id !== shot._id)
    );
  };

  const renderShotItem = ({ item }) => (
    <ShotCard
      shot={item}
      isSelected={selectedShots.some((s) => s._id === item._id)}
      onCheckboxToggle={() => handleCheckboxToggle(item)}
      navigation={navigation}
    />
  );

  const renderSelectedShotItem = ({ item, drag, isActive }) => (
    <Pressable
      onPress={() => handleImagePress(item)}
      onLongPress={drag}
      style={{
        backgroundColor: isActive ? "#e2e2e2" : "#f9f9f9",
        marginRight: 8,
      }}
    >
      <SelectedShotCard item={item} />
    </Pressable>
  );

  const handleNextPage = () => {
    if (selectedShots.length > 0) {
      navigation.navigate("CollageOverview", { selectedImages: selectedShots });
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Media"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Icon
            name="chevron.forward"
            onPress={handleNextPage}
            disabled={selectedShots.length === 0}
            style={iconStyles.backArrow}
            weight={selectedShots.length > 0 ? "heavy" : "semibold"}
            tintColor={selectedShots.length > 0 ? "#6AB952" : "#696969"}
          />
        }
      />
      <View style={styles.selectedContainer}>
        {selectedShots.length === 0 ? (
          <MediaPlaceholder />
        ) : (
          <DraggableFlatList
            data={selectedShots}
            renderItem={renderSelectedShotItem}
            keyExtractor={(item) => item._id.toString()}
            horizontal
            showsHorizontalScrollIndicator={true}
            onDragEnd={({ data }) => setSelectedShots(data)}
          />
        )}
      </View>
      <Text style={styles.instructions}>Camera Shots</Text>
      <FlatList
        data={data.getAllCameraShots}
        renderItem={renderShotItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  selectedContainer: {
    height: 220,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1C1C1C",
  },
  instructions: {
    margin: 8,
    marginTop: 16,
    color: "#fff",
    fontWeight: "600",
  },
  listContainer: {
    flex: 1.5,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
