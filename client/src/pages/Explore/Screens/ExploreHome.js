import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { layoutStyles } from "../../../styles";
import ExploreHeader from "../../../components/Headers/ExploreHeader";
import ExploreNavigator from "../Navigators/ExploreNavigator";
import {
  GET_ALL_USERS,
  GET_ALL_EXPERIENCES,
} from "../../../utils/queries/index";
import { useQuery } from "@apollo/client";
import SearchExperienceCard from "../Cards/SearchExperienceCard";
import SearchUserCard from "../Cards/SearchUserCard";
import LoadingScreen from "../../Loading/LoadingScreen";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import LoadingIcon from "../../Loading/loadingIcon";

export default function ExploreHome({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [isLoading, setIsLoading] = useState(true); // New state to manage the loading screen
  const { setIsTabBarVisible } = useNavigationContext(); // Access the navigation context

  // Hide the tab bar when the screen is focused and `isLoading` is true
  useFocusEffect(
    useCallback(() => {
      if (isLoading) {
        setIsTabBarVisible(false); // Hide tab bar during loading
      }

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 10000); // 10-second delay

      return () => {
        clearTimeout(timer);
      };
    }, [isLoading, setIsTabBarVisible])
  );

  // Show the tab bar again when loading is completed
  useEffect(() => {
    if (!isLoading) {
      setIsTabBarVisible(true); // Show tab bar after loading completes
    }
  }, [isLoading, setIsTabBarVisible]);

  const handleSearch = () => {
    console.log("Search:", searchQuery);
  };

  const handleSearchFocusChange = (isFocused) => {
    setIsSearchFocused(isFocused);
  };

  const {
    data: allUsersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(GET_ALL_USERS, {
    variables: { limit: 50, offset: 0 },
  });

  const {
    data: allExperiencesData,
    loading: experiencesLoading,
    error: experiencesError,
  } = useQuery(GET_ALL_EXPERIENCES, {
    variables: { limit: 50, offset: 0 },
  });

  const filteredUsers = useMemo(() => {
    if (!searchQuery || (activeTab !== "All" && activeTab !== "Users"))
      return [];
    return (allUsersData?.getAllUsers || []).filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allUsersData, activeTab]);

  const filteredExperiences = useMemo(() => {
    if (!searchQuery || (activeTab !== "All" && activeTab !== "Experiences"))
      return [];
    return (allExperiencesData?.getAllExperiences || []).filter((exp) =>
      exp.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allExperiencesData, activeTab]);

  if (isLoading) {
    return <LoadingScreen />; // Render the LoadingScreen during the loading period
  }

  return (
    <View style={layoutStyles.wrapper}>
      <ExploreHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        onSearchFocusChange={handleSearchFocusChange}
      />
      <Text style={styles.loadingText}>Loading...</Text>
      {isSearchFocused && (
        <ExploreNavigator activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      {isSearchFocused && searchQuery === "" ? (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Start typing to search for users & experiences
          </Text>
        </View>
      ) : (
        <FlatList
          data={activeTab === "Users" ? filteredUsers : filteredExperiences}
          renderItem={({ item }) =>
            activeTab === "Users" ? (
              <SearchUserCard user={item} navigation={navigation} />
            ) : (
              <SearchExperienceCard experience={item} navigation={navigation} />
            )
          }
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  instructionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  instructionText: {
    textAlign: "center",
    color: "#d4d4d4",
  },
});
