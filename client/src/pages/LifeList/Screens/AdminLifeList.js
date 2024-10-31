import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { View, Text, Animated } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { headerStyles, layoutStyles } from "../../../styles";
import NavigatorContainer from "../Navigation/NavigatorContainer";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import HeaderMain from "../../../components/Headers/HeaderMain";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";
import SearchBar from "../../../components/SearchBar";
import { iconStyles } from "../../../styles/iconStyles";
import Icon from "../../../components/Icons/Icon";
import {
  getFromAsyncStorage,
  saveToAsyncStorage,
} from "../../../utils/cacheHelper";

export default function AdminLifeList() {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cachedLifeList, setCachedLifeList] = useState(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const cacheKey = `user_lifeList_${currentUser}`;

  // Only fetch if there's no cached data
  const { data, loading, error } = useQuery(GET_USER_LIFELIST, {
    variables: { userId: currentUser },
    skip: !!cachedLifeList, // Skip fetching if cached data exists
  });

  // Load cached LifeList on mount
  useEffect(() => {
    const loadCachedLifeList = async () => {
      const cachedData = await getFromAsyncStorage(cacheKey);
      if (cachedData) {
        console.log("Using cached LifeList data for current user");
        setCachedLifeList(cachedData);
      }
    };
    loadCachedLifeList();
  }, []);

  // Cache LifeList after fetching if no cache was found initially
  useEffect(() => {
    if (data && !cachedLifeList) {
      console.log("Fetched LifeList data from server and updating cache");
      const lifeListData = data.getUserLifeList;
      setCachedLifeList(lifeListData);
      saveToAsyncStorage(cacheKey, lifeListData);
    }
  }, [data, cachedLifeList]);

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

  const lifeList = cachedLifeList ||
    data?.getUserLifeList || { experiences: [] };

  const filteredExperiences = useMemo(() => {
    if (!searchQuery) return lifeList.experiences;
    return lifeList.experiences.filter((exp) =>
      exp.experience.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, lifeList.experiences]);

  const dropdownItems = useMemo(
    () => [
      {
        icon: "plus",
        style: iconStyles.addExperience,
        label: "Add Experiences",
        onPress: () => navigation.navigate("AddExperiences"),
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
            },
          }),
      },
    ],
    [navigation, data]
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      {searchBarVisible && (
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={() => setSearchBarVisible(false)}
        />
      )}
      <HeaderMain
        titleComponent={
          <Text style={[headerStyles.headerHeavy]}>My LifeList</Text>
        }
        icon1={
          <Icon
            name="line.3.horizontal"
            style={iconStyles.list}
            onPress={() =>
              navigation.navigate("LifeListStack", {
                screen: "ListView",
                params: {
                  fromScreen: "HeaderIcon",
                },
              })
            }
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
      <NavigatorContainer
        lifeList={{ experiences: filteredExperiences }}
        navigation={navigation}
      />
    </View>
  );
}
