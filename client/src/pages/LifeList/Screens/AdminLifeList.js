import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { View, Text, Animated } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { headerStyles, layoutStyles } from "../../../styles";
import NavigatorContainer from "../Navigation/NavigatorContainer";
import { useAuth } from "../../../contexts/AuthContext";
import HeaderMain from "../../../components/Headers/HeaderMain";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";
import { iconStyles } from "../../../styles/iconStyles";
import Icon from "../../../components/Icons/Icon";
import { useLifeList } from "../../../contexts/LifeListContext";

export default function AdminLifeList() {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Access LifeListContext
  const { lifeLists, initializeLifeListCache, isLifeListCacheInitialized } =
    useLifeList();

  // Initialize Admin's LifeList cache
  const lifeList = lifeLists[currentUser] || { experiences: [] };
  const isCurrentUser = true; // Always true for AdminLifeList
  const userId = currentUser;

  // Initialize caches on component mount
  useEffect(() => {
    if (!isLifeListCacheInitialized[currentUser]) {
      initializeLifeListCache(currentUser, true);
    }
  }, [initializeLifeListCache, isLifeListCacheInitialized, currentUser]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setDropdownVisible(false);
      };
    }, [])
  );

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

  const dropdownItems = useMemo(
    () => [
      {
        icon: "plus",
        style: iconStyles.addExperience,
        label: "Add Experiences",
        onPress: () =>
          navigation.navigate("AddExperiences", {
            lifeList, // Pass LifeList data
          }),
      },
      {
        icon: "pencil",
        label: "Edit Experiences",
        style: iconStyles.editExperience,
        onPress: () =>
          navigation.navigate("LifeListStack", {
            screen: "ListView",
            params: {
              editMode: true,
              fromScreen: "EditExperiences",
              lifeList: lifeList,
              userId,
              isAdmin: isCurrentUser,
            },
          }),
      },
    ],
    [navigation, lifeList]
  );

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderMain
        titleComponent={
          <Text style={[headerStyles.headerHeavy]}>My LifeList</Text>
        }
        icon1={
          <Icon
            name="line.3.horizontal"
            onPress={() =>
              navigation.navigate("LifeListStack", {
                screen: "ListView",
                params: {
                  fromScreen: "HeaderIcon",
                  lifeList: lifeList,
                  userId,
                  isAdmin: isCurrentUser,
                },
              })
            }
            style={iconStyles.createCollagePlus}
          />
        }
        icon2={
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
      <NavigatorContainer lifeList={lifeList} navigation={navigation} />
    </View>
  );
}
