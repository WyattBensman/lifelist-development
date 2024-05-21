import React, { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SymbolButton from "../../../icons/SymbolButton";
import ShotCard from "../Cards/ShotCard";
import { GET_CAMERA_ALBUM } from "../../../utils/queries/cameraQueries";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";

export default function ViewAlbum() {
  const navigation = useNavigation();
  const route = useRoute();
  const { albumId } = route.params;
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { data, loading, error } = useQuery(GET_CAMERA_ALBUM, {
    variables: { albumId },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const album = data.getCameraAlbum;

  const renderShot = ({ item }) => <ShotCard shot={item} />;

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const dropdownItems = [
    {
      icon: "plus.square",
      label: "Add Shots",
      onPress: () => console.log("Add Shots to Album"),
    },
    {
      icon: "minus.square",
      label: "Remove Shots",
      onPress: () => console.log("Remove Shots from Album"),
    },
    {
      icon: "trash.square",
      label: "Delete Album",
      onPress: () => console.log("Delete Album"),
    },
  ];

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={<BackArrowIcon navigation={navigation} />}
        title={album.title}
        button1={
          <SymbolButton
            name={!dropdownVisible ? "ellipsis.circle" : "ellipsis.circle.fill"}
            onPress={toggleDropdown}
          />
        }
        dropdownVisible={dropdownVisible}
        dropdownContent={<DropdownMenu items={dropdownItems} />}
      />
      <FlatList
        data={album.shots}
        renderItem={renderShot}
        keyExtractor={(item) => item._id}
        numColumns={3}
      />
    </View>
  );
}
