import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { iconStyles, layoutStyles } from "../../../styles";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useLifeList } from "../../../contexts/LifeListContext";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import Icon from "../../../components/Icons/Icon";
import ListViewNavigator from "../Navigators/ListViewNavigator";
import AddShotToExperienceCard from "../Cards/AddShotToExperienceCard";
import { useAuth } from "../../../contexts/AuthContext";

export default function AddShotToExperience({ navigation, route }) {
  const { setIsTabBarVisible } = useNavigationContext();
  const { lifeLists, initializeLifeListCache, isLifeListCacheInitialized } =
    useLifeList();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filteredExperiences, setFilteredExperiences] = useState([]);

  const shotId = route.params.shotId;

  // Hide tab bar when component is focused
  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  // Initialize caches on component mount
  useEffect(() => {
    const initializeCaches = async () => {
      try {
        if (!isLifeListCacheInitialized[currentUser]) {
          await initializeLifeListCache(currentUser);
        }
      } catch (error) {
        console.error(
          "[AddShotToExperience] Error initializing caches:",
          error
        );
      }
    };
    initializeCaches();
  }, [isLifeListCacheInitialized, currentUser]);

  // Filter experiences by list type and search query
  useEffect(() => {
    const lifeList = lifeLists[currentUser];
    if (lifeList) {
      const experiences = lifeList.experiences.filter(
        (exp) => exp.list === "EXPERIENCED"
      );

      const filtered = experiences.filter((exp) =>
        exp.experience.title
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      );

      setFilteredExperiences(filtered);
    }
  }, [lifeLists, currentUser, searchQuery]);

  const handleBackPress = () => navigation.goBack();

  if (!isLifeListCacheInitialized[currentUser]) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading LifeList...</Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderSearchBar
        arrowIcon={
          <Icon
            name="chevron.backward"
            onPress={handleBackPress}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchFocused={isSearchFocused}
        onSearchFocusChange={setIsSearchFocused}
      />
      <ListViewNavigator
        lifeList={{ experiences: filteredExperiences }}
        searchQuery={searchQuery}
        navigation={navigation}
        cardComponent={(props) => (
          <AddShotToExperienceCard {...props} shotId={shotId} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
});
