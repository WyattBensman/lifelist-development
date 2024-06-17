import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { headerStyles, layoutStyles } from "../../../styles";
import NavigatorContainer from "../Navigation/NavigatorContainer";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import HeaderMain from "../../../components/Headers/HeaderMain";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";
import SearchBar from "../../../components/SearchBar";
import Icon from "../../../icons/Icon";
import { iconStyles } from "../../../styles/iconStyles";
import { SymbolView } from "expo-symbols";

export default function AdminLifeList() {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        icon: "plus.square",
        style: iconStyles.plusSquare,
        label: "Add Experiences",
        onPress: () => navigation.navigate("AddExperiences"),
      },
      {
        icon: "square.and.pencil",
        label: "Edit Experiences",
        style: iconStyles.squarePencil,
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
              })
            }
          />
        }
        icon2={
          <Icon
            name={!dropdownVisible ? "ellipsis.circle" : "ellipsis.circle.fill"}
            style={iconStyles.ellipsisCircle}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          />
        }
        icon3={
          <View style={styles.iconContainer}>
            <SymbolView name="bell" style={styles.bell} tintColor={"#000"} />
          </View>
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

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  iconContainer: {
    backgroundColor: "#f3f3f3", // light gray background
    borderRadius: 50, // make it circular
    padding: 10, // adjust padding as needed
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  // Header Icons
  bell: {
    height: 20,
    width: 18.62,
  },
});
