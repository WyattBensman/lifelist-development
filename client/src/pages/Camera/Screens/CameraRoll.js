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
import groupShotsByDate from "../../../utils/groupShotsByDate";

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

  const groupedShots = groupShotsByDate(shotsData.getAllCameraShots);

  const renderAlbum = ({ item }) => (
    <AlbumCard album={item} navigation={navigation} />
  );

  const renderShot = ({ item }) => (
    <ShotCard shot={item} navigation={navigation} />
  );

  const renderGroupedShots = () => {
    const sections = [];

    if (groupedShots["Yesterday"].length > 0) {
      sections.push({ title: "Yesterday", data: groupedShots["Yesterday"] });
    }

    if (groupedShots["Within the past week"].length > 0) {
      sections.push({
        title: "Within the past week",
        data: groupedShots["Within the past week"],
      });
    }

    Object.keys(groupedShots["Older"]).forEach((month) => {
      sections.push({ title: month, data: groupedShots["Older"][month] });
    });

    return sections.map((section, index) => (
      <View key={index} style={layoutStyles.marginTopMd}>
        <Text style={headerStyles.headerMedium}>Camera Shots</Text>
        <Text style={{ marginBottom: 8, color: "#d4d4d4" }}>
          {section.title}
        </Text>
        <FlatList
          data={section.data}
          renderItem={renderShot}
          keyExtractor={(item) => item._id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          style={layoutStyles.paddingLeftXxs}
        />
      </View>
    ));
  };

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
        {renderGroupedShots()}
      </View>
    </View>
  );
}
