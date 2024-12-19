import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, Animated, StyleSheet } from "react-native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { iconStyles, layoutStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";
import ViewExperienceCard from "../Cards/ViewExperienceCard";
import { useLifeList } from "../../../contexts/LifeListContext";
import { useAuth } from "../../../contexts/AuthContext";

export default function ViewExperience({ route, navigation }) {
  const { setIsTabBarVisible } = useNavigationContext();
  const { experienceId } = route.params;
  const { currentUser } = useAuth();

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // LifeListContext
  const { lifeLists } = useLifeList();

  // Get current user's LifeList and the experience
  const currentUserLifeList = lifeLists[currentUser];

  const currentExperience = currentUserLifeList?.experiences?.find(
    (exp) => exp._id === experienceId
  );

  const shots = currentExperience?.associatedShots || [];

  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  // Dropdown animation
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

  const dropdownItems = [
    {
      icon: "pencil",
      label: "Manage Shots",
      onPress: () =>
        navigation.navigate("ManageShots", {
          experienceId,
          associatedShots: shots,
        }),
    },
  ];

  const renderShot = ({ item }) => (
    <ViewExperienceCard
      shot={item}
      associatedShots={shots}
      navigation={navigation}
    />
  );

  if (!currentExperience) {
    return <Text>Loading Experience...</Text>;
  }

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={currentExperience.experience.title || "Experience"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Icon
              name="pencil"
              style={styles.pencil}
              weight="bold"
              onPress={() =>
                navigation.navigate("ManageShots", {
                  experienceId,
                  associatedShots: shots,
                })
              }
            />
          </Animated.View>
        }
        dropdownVisible={dropdownVisible}
        dropdownContent={<DropdownMenu items={dropdownItems} />}
      />
      <FlatList
        data={shots}
        renderItem={renderShot}
        keyExtractor={(item) => item._id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
    marginHorizontal: 0,
  },
  pencil: {
    width: 16,
    height: 15.6,
  },
});
