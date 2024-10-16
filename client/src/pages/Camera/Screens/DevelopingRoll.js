import React, { useState, useCallback } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_DEVELOPING_CAMERA_SHOTS } from "../../../utils/queries/cameraQueries";
import Icon from "../../../components/Icons/Icon";
import BlurredShotCard from "../Cards/BlurredShotCard";
import MessageAlert from "../../../components/Alerts/MessageAlert";

export default function DevelopingRoll() {
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);

  // Use Apollo's useQuery hook to get data and the refetch function
  const { data, loading, error, refetch } = useQuery(
    GET_DEVELOPING_CAMERA_SHOTS
  );

  // Refetch data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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
          data={data.getDevelopingCameraShots}
          renderItem={({ item }) => <BlurredShotCard shot={item} />}
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
