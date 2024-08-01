import React, { useCallback } from "react";
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

export default function CameraRoll() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();

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
            onPress={() => navigation.navigate("CreateAlbum")}
            weight="semibold"
            style={iconStyles.createAlbum}
          />
        }
      />
      <ScrollView style={layoutStyles.paddingTopSm}>
        <Text style={[headerStyles.headerMedium, { marginLeft: 4 }]}>
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
          <Text style={headerStyles.headerMedium}>Camera Shots</Text>
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
