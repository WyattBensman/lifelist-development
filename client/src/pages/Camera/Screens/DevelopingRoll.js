import React, { useState, useEffect } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_DEVELOPING_CAMERA_SHOTS } from "../../../utils/queries/cameraQueries";
import Icon from "../../../components/Icons/Icon";
import BlurredShotCard from "../Cards/BlurredShotCard";
import MessageAlert from "../../../components/Alerts/MessageAlert";
import {
  saveMetaDataToCache,
  getMetaDataFromCache,
} from "../../../utils/cacheHelper";

export default function DevelopingRoll() {
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [cachedShots, setCachedShots] = useState([]);

  const cacheKey = "developingCameraShots";

  // Fetch shots from the cache or the server
  useEffect(() => {
    const fetchCachedShots = async () => {
      const cachedData = getMetaDataFromCache(cacheKey);
      if (cachedData) {
        console.log("Using cached developing shots");
        setCachedShots(cachedData);
      } else {
        refetchShots(); // Fetch from the server if no cached data
      }
    };

    fetchCachedShots();
  }, []);

  // Use Apollo's useQuery hook to get data and refetch function
  const {
    data,
    loading,
    error,
    refetch: refetchShots,
  } = useQuery(GET_DEVELOPING_CAMERA_SHOTS, {
    skip: !!cachedShots.length, // Skip fetching if cached shots exist
  });

  // Cache fetched shots metadata
  useEffect(() => {
    if (data && !cachedShots.length) {
      const shots = data.getDevelopingCameraShots;
      setCachedShots(shots);
      saveMetaDataToCache(cacheKey, shots); // No TTL for session-based caching
      console.log("Fetched and cached developing shots");
    }
  }, [data, cachedShots]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const toggleAlert = () => {
    setAlertVisible(!alertVisible);
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"In Development"}
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
            name="info"
            style={iconStyles.info}
            weight="semibold"
            onPress={toggleAlert}
          />
        }
      />
      <View style={layoutStyles.marginTopSm}>
        <FlatList
          data={cachedShots}
          renderItem={({ item }) => (
            <BlurredShotCard shot={item} refetchShots={refetchShots} />
          )}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <MessageAlert
        visible={alertVisible}
        onRequestClose={toggleAlert}
        message="Camera Shots will be fully developed by 6am tomorrow!"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
  },
});
