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

export default function AdminLifeList() {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { data, loading, error, refetch } = useQuery(GET_USER_LIFELIST, {
    variables: { userId: currentUser._id },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
      return () => {
        setDropdownVisible(false);
      };
    }, [refetch])
  );

  useEffect(() => {
    if (data) {
      setIsAdmin(true);
    }
  }, [data]);

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

  const lifeList = data?.getUserLifeList || { experiences: [] };

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
