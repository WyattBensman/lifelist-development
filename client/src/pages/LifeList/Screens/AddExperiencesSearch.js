import React, { useState, useMemo, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import SearchItemCard from "../Cards/SearchItemCard";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import AddExperiencesBottomContainer from "../Components/AddExperiencesBottomContainer";
import { GET_ALL_EXPERIENCES } from "../../../utils/queries";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useLifeListExperienceContext } from "../../../contexts/LifeListExperienceContext";
import DangerAlert from "../../../components/Alerts/DangerAlert";

const LIMIT = 20; // Number of items per page

export default function AddExperiencesSearch({ route }) {
  const navigation = useNavigation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { setIsTabBarVisible } = useNavigationContext();

  const { lifeList } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [allExperiences, setAllExperiences] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

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

  // Reset experiences when the component mounts
  useEffect(() => {
    resetLifeListExperiences();
  }, []);

  // Debounce the search query for efficient filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // Delay of 300ms
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch paginated experiences from the server
  const { data, loading, error, fetchMore } = useQuery(GET_ALL_EXPERIENCES, {
    variables: { cursor: null, limit: LIMIT },
    fetchPolicy: "network-only", // Always fetch fresh data
  });

  // Append fetched experiences to the state
  useEffect(() => {
    if (data?.getAllExperiences) {
      const { experiences, nextCursor: newCursor } = data.getAllExperiences;
      setAllExperiences((prev) => [...prev, ...experiences]);
      setNextCursor(newCursor);
    }
  }, [data]);

  // Load more experiences when user reaches the end of the list
  const loadMoreExperiences = () => {
    if (isFetchingMore || !nextCursor) return;

    setIsFetchingMore(true);
    fetchMore({
      variables: { cursor: nextCursor, limit: LIMIT },
      updateQuery: (prev, { fetchMoreResult }) => {
        setIsFetchingMore(false);
        if (!fetchMoreResult) return prev;

        const { experiences, nextCursor: newCursor } =
          fetchMoreResult.getAllExperiences;
        setAllExperiences((prev) => [...prev, ...experiences]);
        setNextCursor(newCursor);
      },
    });
  };

  const userExperienceIds = new Set(
    lifeList.experiences.map((exp) => exp.experience._id)
  );

  // Filter experiences based on the search query
  const filteredExperiences = useMemo(() => {
    if (!debouncedQuery) return [];
    return allExperiences.filter((exp) =>
      exp.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, allExperiences]);

  // Handle selecting/deselecting experiences
  const handleSelect = (experience, isSelected) => {
    if (isSelected) {
      addLifeListExperience(experience); // Add experience to lifeList
    } else {
      removeLifeListExperience(experience._id); // Remove by ID
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

  if (loading && !allExperiences.length) return <Text>Loading...</Text>;
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
      {filteredExperiences.length === 0 && !loading && (
        <Text style={styles.instructionText}>No experiences found.</Text>
      )}
      <FlatList
        data={filteredExperiences}
        renderItem={({ item }) => (
          <SearchItemCard
            experience={item}
            isSelected={lifeListExperiences.some(
              (exp) => exp.experience._id === item._id
            )}
            onSelect={handleSelect}
            isPreExisting={lifeList.experiences.some(
              (exp) => exp.experience._id === item._id
            )}
          />
        )}
        keyExtractor={(item) => item._id}
        onEndReached={loadMoreExperiences} // Trigger pagination
        onEndReachedThreshold={0.5} // Trigger at 50% from the bottom
        ListFooterComponent={isFetchingMore && <Text>Loading more...</Text>}
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
      <DangerAlert
        visible={showAlert}
        onRequestClose={() => setShowAlert(false)}
        title="Confirm Navigation"
        message="You have made changes. Do you want to save them before leaving?"
        onConfirm={handleConfirmAlert} // Action for "Leave"
        onCancel={() => setShowAlert(false)} // Action for "Discard"
        confirmButtonText="Leave"
        cancelButtonText="Discard"
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
