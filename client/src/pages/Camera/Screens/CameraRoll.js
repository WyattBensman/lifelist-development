import React from "react";
import { FlatList, Text, View } from "react-native";
import { headerStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import {
  GET_ALL_CAMERA_ALBUMS,
  GET_ALL_CAMERA_SHOTS,
} from "../../../utils/queries/cameraQueries";
import AlbumCard from "../Cards/AlbumCard";
import ShotCard from "../Cards/ShotCard";
import SymbolButton from "../../../icons/SymbolButton";
import { useAuth } from "../../../contexts/AuthContext";

export default function CameraRoll() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  const {
    data: albumsData,
    loading: albumsLoading,
    error: albumsError,
  } = useQuery(GET_ALL_CAMERA_ALBUMS);
  const {
    data: shotsData,
    loading: shotsLoading,
    error: shotsError,
  } = useQuery(GET_ALL_CAMERA_SHOTS);

  if (albumsLoading || shotsLoading) return <Text>Loading...</Text>;
  if (albumsError) return <Text>Error: {albumsError.message}</Text>;
  if (shotsError) return <Text>Error: {shotsError.message}</Text>;

  const renderAlbum = ({ item }) => (
    <AlbumCard album={item} navigation={navigation} />
  );
  const renderShot = ({ item }) => (
    <ShotCard shot={item} navigation={navigation} />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Camera Roll"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={
          <SymbolButton
            name="plus.square"
            onPress={() => navigation.navigate("CreateAlbum")}
          />
        }
      />
      <View style={[layoutStyles.marginTopSm, layoutStyles.paddingLeftXxs]}>
        <Text style={headerStyles.headerMedium}>Albums</Text>
        <FlatList
          data={albumsData.getAllCameraAlbums}
          renderItem={renderAlbum}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={layoutStyles.paddingLeftXxs}
        />
        <Text style={[headerStyles.headerMedium, layoutStyles.marginTopMd]}>
          Shots
        </Text>
        <FlatList
          data={shotsData.getAllCameraShots}
          renderItem={renderShot}
          keyExtractor={(item) => item._id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          style={layoutStyles.paddingLeftXxs}
        />
      </View>
    </View>
  );
}
