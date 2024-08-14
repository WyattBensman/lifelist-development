import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { useQuery } from "@apollo/client";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_LIFELIST_EXPERIENCE } from "../../../utils/queries/lifeListQueries";
import { iconStyles, layoutStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import ExperienceNavigator from "../Navigation/ExperienceNavigator";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useFocusEffect } from "@react-navigation/native";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";

export default function ViewExperience({ route, navigation }) {
  const { setIsTabBarVisible } = useNavigationContext();
  const { experienceId } = route.params;
  const { data, loading, error } = useQuery(GET_LIFELIST_EXPERIENCE, {
    variables: { experienceId },
  });

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: dropdownVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [dropdownVisible]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const { experience, associatedShots } = data.getLifeListExperience;

  const dropdownItems = [
    {
      icon: "pencil",
      label: "Manage Shots",
      onPress: () => {
        // Handle manage shots
        console.log("Manage Shots");
      },
    },
    {
      icon: "trash",
      label: "Remove Shots",
      onPress: () => {
        // Handle remove shots
        console.log("Remove Shots");
      },
    },
  ];

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
        hasBorder={false}
        button1={
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Icon
              name="ellipsis"
              style={iconStyles.ellipsis}
              weight="bold"
              onPress={() => setDropdownVisible(!dropdownVisible)}
            />
          </Animated.View>
        }
        dropdownVisible={dropdownVisible}
        dropdownContent={<DropdownMenu items={dropdownItems} />}
      />
      <ExperienceNavigator
        experienceId={experienceId}
        associatedShots={associatedShots}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
