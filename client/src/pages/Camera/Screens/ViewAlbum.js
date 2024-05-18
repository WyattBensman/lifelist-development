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
import SymbolButtonLg from "../../../icons/SymbolButtonLg";

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

  const dropdownContent = (
    <View style={styles.dropdownContainer}>
      <Pressable
        style={styles.dropdownItemContainer}
        onPress={() => console.log("Add Shots to Album")}
      >
        <SymbolButtonLg name="plus.square" />
        <Text style={styles.dropdownItem}>Add Shots</Text>
      </Pressable>
      <Pressable
        style={styles.dropdownItemContainer}
        onPress={() => console.log("Add Shots to Album")}
      >
        <SymbolButtonLg name="minus.square" />
        <Text style={styles.dropdownItem}>Remove Shots</Text>
      </Pressable>
      <Pressable
        style={styles.dropdownItemContainer}
        onPress={() => console.log("Add Shots to Album")}
      >
        <SymbolButtonLg name="trash.square" />
        <Text style={styles.dropdownItem}>Delete Album</Text>
      </Pressable>
    </View>
  );

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
        dropdownContent={dropdownContent}
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

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 32,
    marginTop: 16,
  },
  dropdownItemContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: 100,
  },
  dropdownItem: {
    padding: 4,
    fontSize: 12,
  },
});
