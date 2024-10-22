import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { useAuth } from "../../../contexts/AuthContext";
import SearchItemCard from "../Cards/SearchItemCard";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import AddExperiencesBottomContainer from "../Components/AddExperiencesBottomContainer";
import { GET_USER_LIFELIST, GET_ALL_EXPERIENCES } from "../../../utils/queries";
import CustomAlert from "../../../components/Alerts/CustomAlert";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useLifeListExperienceContext } from "../../../contexts/LifeListExperienceContext";

export default function AddExperiencesSearch() {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { setIsTabBarVisible } = useNavigationContext();

  // LifeListExperienceContext methods
  const {
    lifeListExperiences,
    addLifeListExperience,
    removeLifeListExperience,
    resetLifeListExperiences,
    hasModified,
  } = useLifeListExperienceContext();

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  console.log(lifeListExperiences);

  // Reset experiences when the component mounts
  useEffect(() => {
    resetLifeListExperiences();
  }, []);

  // Fetch LifeList data for the current user
  const { data: lifeListData, refetch: refetchLifeList } = useQuery(
    GET_USER_LIFELIST,
    {
      variables: { userId: currentUser },
    }
  );

  // Fetch all experiences from the database
  const {
    data: allExperiencesData,
    loading,
    error,
  } = useQuery(GET_ALL_EXPERIENCES);

  // Refetch lifeList when the screen is focused
  useFocusEffect(
    useCallback(() => {
      refetchLifeList();
    }, [refetchLifeList])
  );

  const lifeList = lifeListData?.getUserLifeList || { experiences: [] };
  const userExperienceIds = new Set(
    lifeList.experiences.map((exp) => exp.experience._id)
  );

  // Filter experiences based on the search query
  const filteredExperiences = useMemo(() => {
    if (!searchQuery) return [];
    return (allExperiencesData?.getAllExperiences || []).filter((exp) =>
      exp.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allExperiencesData]);

  // Handle selecting/deselecting experiences
  const handleSelect = (experience, isSelected) => {
    if (isSelected) {
      addLifeListExperience(experience); // Add the full experience object here
    } else {
      removeLifeListExperience(experience._id); // Remove by experience._id
    }
  };

  // Handle back navigation, reset if no changes or fewer than 3 experiences
  const handleBackNavigation = () => {
    if (lifeListExperiences.length >= 3 || hasModified) {
      setShowAlert(true);
    } else {
      resetLifeListExperiences();
      navigation.goBack();
    }
  };

  // Confirm leaving with modifications
  const handleConfirmAlert = () => {
    setShowAlert(false);
    resetLifeListExperiences();
    navigation.goBack();
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderSearchBar
        arrowIcon={
          <Icon
            name="chevron.backward"
            onPress={handleBackNavigation}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={() => {}}
        isSearchFocused={isSearchFocused}
        onSearchFocusChange={setIsSearchFocused}
      />
      {searchQuery === "" && (
        <Text style={styles.instructionText}>
          Start typing to search for experiences
        </Text>
      )}
      <FlatList
        data={filteredExperiences}
        renderItem={({ item }) => (
          <SearchItemCard
            experience={item}
            isSelected={lifeListExperiences.some(
              (exp) => exp.experience._id === item._id // Compare with experience._id
            )}
            onSelect={handleSelect}
            isPreExisting={userExperienceIds.has(item._id)}
          />
        )}
        keyExtractor={(item) => item._id}
      />
      <AddExperiencesBottomContainer
        onAdd={() =>
          navigation.navigate("AddExperiencesOverview", {
            lifeListId: lifeList._id,
          })
        }
        onDeselect={() => resetLifeListExperiences()}
        isAddDisabled={lifeListExperiences.length === 0}
      />

      <CustomAlert
        visible={showAlert}
        onRequestClose={() => setShowAlert(false)}
        title="Confirm Navigation"
        message="You have made changes. Do you want to save them before leaving?"
        onConfirm={handleConfirmAlert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  instructionText: {
    textAlign: "center",
    marginTop: 20,
    color: "#d4d4d4",
  },
});
