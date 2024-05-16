import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { layoutStyles } from "../../../styles";
import { BlurView } from "expo-blur";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import InformationIcon from "../Icons/InformationIcon";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_DEVELOPING_CAMERA_SHOTS } from "../../../utils/queries/cameraQueries";

const { width } = Dimensions.get("window");
const imageWidth = width / 2;
const imageHeight = (imageWidth * 3) / 2;

export default function DevelopingRoll() {
  const navigation = useNavigation();

  const { data, loading, error } = useQuery(GET_DEVELOPING_CAMERA_SHOTS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <BlurView intensity={8} style={styles.blurView} />
    </View>
  );

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"In Development"}
        arrow={<BackArrowIcon navigation={navigation} />}
        button1={<InformationIcon />}
      />
      <FlatList
        data={data.getDevelopingCameraShots}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: imageWidth,
    height: imageHeight,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
});
