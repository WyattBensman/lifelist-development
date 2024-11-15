import React, { useState, useEffect } from "react";
import { FlatList, Text, View, StyleSheet, ScrollView } from "react-native";
import { headerStyles, iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigation } from "@react-navigation/native";
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
  const [albumsData, setAlbumsData] = useState(null);
  const [shotsData, setShotsData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Load cached data on component mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedAlbums = await getCachedAlbumMetadata();
        if (cachedAlbums) setAlbumsData(cachedAlbums);

        const cachedShots = await getCachedCameraShots();
        if (cachedShots) setShotsData(cachedShots);

        setIsDataLoading(!cachedAlbums || !cachedShots);
      } catch (error) {
        console.error("Error loading cached data:", error);
      }
    };
    loadCachedData();
  }, []);

  // Fetch albums data from server if not cached
  const { loading: albumsLoading, error: albumsError } = useQuery(
    GET_ALL_CAMERA_ALBUMS,
    {
      variables: { userId: currentUser },
      skip: !!albumsData, // Skip fetching if albums data is cached
      onCompleted: async (data) => {
        setAlbumsData(data.getAllCameraAlbums);
        await cacheAlbumMetadata(data.getAllCameraAlbums);

        // Cache album cover images
        for (let album of data.getAllCameraAlbums) {
          await saveImageToFileSystem(
            `album_cover_${album._id}`,
            album.coverImage
          );
        }
      },
    }
  );

  // Fetch camera shots data from server if not cached
  const { loading: shotsLoading, error: shotsError } = useQuery(
    GET_ALL_CAMERA_SHOTS,
    {
      variables: { userId: currentUser._id },
      skip: !!shotsData, // Skip fetching if shots data is cached
      onCompleted: async (data) => {
        setShotsData(data.getAllCameraShots);
        await cacheCameraShots(data.getAllCameraShots);

        // Cache all shot images
        for (let shot of data.getAllCameraShots) {
          await saveImageToFileSystem(`camera_shot_${shot._id}`, shot.image);
        }
      },
    }
  );

  const renderAlbum = ({ item }) => (
    <AlbumCard album={item} navigation={navigation} />
  );
  const renderShot = ({ item, index }) => (
    <ShotCard
      shot={item}
      shots={shotsData}
      navigation={navigation}
      index={index}
    />
  );

  const handleCreateAlbum = (title) => {
    setAlbumModalVisible(false);
    navigation.navigate("CreateAlbum", { albumTitle: title });
    setNewAlbumTitle(""); // Reset album title
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
            onPress={() => setAlbumModalVisible(true)}
            weight="semibold"
            style={iconStyles.createAlbum}
          />
        }
      />

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
          data={albumsData}
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
            data={shotsData}
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
