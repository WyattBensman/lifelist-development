import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList, Pressable } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_ALL_CAMERA_SHOTS } from "../../../utils/queries";
import { layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import ShotCard from "../Cards/ShotCard";
import SelectedShotCard from "../Cards/SelectedShotCard";
import NextPageArrowIcon from "../../../icons/Universal/NextPageArrowIcon";

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

  const renderSelectedShotItem = ({ item }) => (
    <SelectedShotCard
      item={item}
      handleImagePress={() => handleImagePress(item)}
    />
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
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={
          <NextPageArrowIcon
            onPress={handleNextPage}
            disabled={selectedShots.length === 0}
            color={selectedShots.length > 0 ? "#6AB952" : "#ececec"}
          />
        }
      />
      <View style={styles.selectedContainer}>
        <FlatList
          data={selectedShots}
          renderItem={renderSelectedShotItem}
          keyExtractor={(item) => item._id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <Text style={styles.instructions}>Camera Shots</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={data.getAllCameraShots}
          renderItem={renderShotItem}
          keyExtractor={(item) => item._id.toString()}
          numColumns={4}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  instructions: {
    margin: 8,
  },
  listContainer: {
    flex: 2,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
