import React, { useState } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { headerStyles, iconStyles, layoutStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_DEVELOPING_CAMERA_SHOTS } from "../../../utils/queries/cameraQueries";
import Icon from "../../../components/Icons/Icon";
import BlurredShotCard from "../Cards/BlurredShotCard";
import DropdownInfo from "../../../components/Dropdowns/DropdownInfo";

export default function DevelopingRoll() {
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { data, loading, error } = useQuery(GET_DEVELOPING_CAMERA_SHOTS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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
            onPress={toggleDropdown} // Add onPress handler
          />
        }
        dropdownVisible={dropdownVisible}
        dropdownContent={
          <DropdownInfo
            lineOne="Camera Shots will be fully developed by 6am tomorrow!"
            lineTwo="We'll let you know when they're available."
          />
        }
        toggleDropdown={toggleDropdown}
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
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
  },
});
