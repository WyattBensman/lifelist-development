import React, { useState, useCallback } from "react";
import { FlatList, Text, View, StyleSheet, ScrollView } from "react-native";
import { headerStyles, iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import {
  GET_ALL_CAMERA_ALBUMS,
  GET_ALL_CAMERA_SHOTS,
} from "../../../utils/queries/cameraQueries";
import AlbumCard from "../Cards/AlbumCard";
import ShotCard from "../Cards/ShotCard";
import { useAuth } from "../../../contexts/AuthContext";
import Icon from "../../../components/Icons/Icon";
import FormAlert from "../../../components/Alerts/FormAlert";

export default function CameraRoll() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [albumModalVisible, setAlbumModalVisible] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");

  const {
    data: albumsData,
    loading: albumsLoading,
    error: albumsError,
    refetch: refetchAlbums,
  } = useQuery(GET_ALL_CAMERA_ALBUMS, {
    variables: { userId: currentUser._id },
  });

  const {
    data: shotsData,
    loading: shotsLoading,
    error: shotsError,
  } = useQuery(GET_ALL_CAMERA_SHOTS, {
    variables: { userId: currentUser._id },
  });

  useFocusEffect(
    useCallback(() => {
      refetchAlbums();
    }, [refetchAlbums])
  );

  if (albumsLoading || shotsLoading) return <Text>Loading...</Text>;
  if (albumsError) return <Text>Error: {albumsError.message}</Text>;
  if (shotsError) return <Text>Error: {shotsError.message}</Text>;

  const renderAlbum = ({ item }) => (
    <AlbumCard album={item} navigation={navigation} />
  );
  const renderShot = ({ item, index }) => (
    <ShotCard
      shot={item}
      shots={shotsData.getAllCameraShots}
      navigation={navigation}
      index={index}
    />
  );

  const handleCreateAlbum = (title) => {
    setAlbumModalVisible(false);
    navigation.navigate("CreateAlbum", { albumTitle: title });
    setNewAlbumTitle(""); // Reset the album title
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Camera Roll"}
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
            name="folder.badge.plus"
            onPress={() => setAlbumModalVisible(true)} // Show the FormAlert modal
            weight="semibold"
            style={iconStyles.createAlbum}
          />
        }
      />

      {/* FormAlert for creating a new album */}
      <FormAlert
        visible={albumModalVisible}
        title="New Album"
        subheader="Enter a name for this album."
        onRequestClose={() => setAlbumModalVisible(false)}
        onSave={handleCreateAlbum}
      />

      <ScrollView
        style={layoutStyles.paddingTopXs}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[headerStyles.headerMedium, { marginLeft: 10 }]}>
          Albums
        </Text>
        <FlatList
          data={albumsData.getAllCameraAlbums}
          renderItem={renderAlbum}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={layoutStyles.paddingLeftXxs}
        />
        <View style={layoutStyles.marginTopMd}>
          <Text style={[headerStyles.headerMedium, { marginLeft: 10 }]}>
            Camera Shots
          </Text>
          <FlatList
            data={shotsData.getAllCameraShots}
            renderItem={renderShot}
            keyExtractor={(item) => item._id}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
  },
});
