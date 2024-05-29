import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { headerStyles, layoutStyles } from "../../../styles";
import CategoryNavigator from "../Navigation/CategoryNavigator";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import HeaderStack from "../../../components/Headers/HeaderStack";
import HeaderMain from "../../../components/Headers/HeaderMain";
import SymbolButton from "../../../icons/SymbolButton";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";
import SearchBar from "../../../components/SearchBar";

export default function AdminLifeList() {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state

  const { data, loading, error, refetch } = useQuery(GET_USER_LIFELIST, {
    variables: { userId: currentUser._id },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
      return () => {
        // Set dropdownVisible to false when the screen loses focus
        setDropdownVisible(false);
      };
    }, [refetch])
  );

  useEffect(() => {
    if (data) {
      setIsAdmin(true);
    }
  }, [data]);

  const lifeList = data?.getUserLifeList || { experiences: [] };

  // Filter experiences based on search query
  const filteredExperiences = useMemo(() => {
    if (!searchQuery) return lifeList.experiences;
    return lifeList.experiences.filter((exp) =>
      exp.experience.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, lifeList.experiences]);

  const dropdownItems = useMemo(
    () => [
      {
        icon: "plus.square",
        label: "Add Experiences",
        onPress: () => navigation.navigate("AddExperiences"),
      },
      {
        icon: "square.and.pencil",
        label: "Edit Experiences",
        style: { marginBottom: 3, height: 26 },
        onPress: () =>
          navigation.navigate("LifeListStack", {
            screen: "ListView",
            params: {
              editMode: true,
              fromScreen: "AdminLifeList",
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
      {isAdmin ? (
        <HeaderMain
          titleComponent={
            <Text style={headerStyles.headerHeavy}>My LifeList</Text>
          }
          icon1={
            <SymbolButton
              name="line.3.horizontal"
              style={{ height: 22, width: 22 }}
              onPress={() =>
                navigation.navigate("LifeListStack", {
                  screen: "ListView",
                })
              }
            />
          }
          icon2={
            <SymbolButton
              name={
                !dropdownVisible ? "ellipsis.circle" : "ellipsis.circle.fill"
              }
              onPress={() => setDropdownVisible(!dropdownVisible)}
            />
          }
          dropdownVisible={dropdownVisible}
          dropdownContent={<DropdownMenu items={dropdownItems} />}
        />
      ) : (
        <HeaderStack
          arrow={<BackArrowIcon />}
          title={"LifeList"}
          button1={
            <SymbolButton
              name="magnifyingglass"
              onPress={() => setSearchBarVisible(!searchBarVisible)} // Toggle search bar visibility
            />
          }
          button2={<SymbolButton name="line.3.horizontal" />}
        />
      )}
      <CategoryNavigator lifeList={{ experiences: filteredExperiences }} />
    </View>
  );
}
