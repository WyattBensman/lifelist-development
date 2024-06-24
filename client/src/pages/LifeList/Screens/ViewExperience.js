import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useQuery } from "@apollo/client";
import HeaderStack from "../../../components/Headers/HeaderStack";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { BASE_URL } from "../../../utils/config";
import { GET_LIFELIST_EXPERIENCE } from "../../../utils/queries/lifeListQueries";
import { iconStyles, layoutStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";

const { width } = Dimensions.get("window");
const imageWidth = width / 2;
const imageHeight = (imageWidth * 3) / 2;

export default function ViewExperience({ route, navigation }) {
  const { experienceId } = route.params;
  const { data, loading, error } = useQuery(GET_LIFELIST_EXPERIENCE, {
    variables: { experienceId },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const { experience, associatedShots } = data.getLifeListExperience;

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: `${BASE_URL}${item.shot.image}` }}
        style={styles.image}
      />
    </View>
  );

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={experience.title}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={associatedShots}
        keyExtractor={(item) => item.shot._id}
        renderItem={renderItem}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    width: imageWidth,
    height: imageHeight,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
