import React, { useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { useAuth } from "../../../contexts/AuthContext";
import SearchItemCard from "../Cards/SearchItemCard";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import AddExperiencesBottomContainer from "../Components/AddExperiencesBottomContainer";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import { GET_ALL_EXPERIENCES } from "../../../utils/queries/experienceQueries";
import Icon from "../../../components/Icons/Icon";

export default function AddExperiencesSearch() {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedExperiences, setSelectedExperiences] = useState([]);

  const { data: lifeListData, refetch: refetchLifeList } = useQuery(
    GET_USER_LIFELIST,
    {
      variables: { userId: currentUser._id },
    }
  );

  const {
    data: allExperiencesData,
    loading,
    error,
  } = useQuery(GET_ALL_EXPERIENCES);

  useFocusEffect(
    useCallback(() => {
      refetchLifeList();
    }, [refetchLifeList])
  );

  console.log(lifeListData);
  console.log(allExperiencesData);

  const lifeList = lifeListData?.getUserLifeList || { experiences: [] };
  const userExperienceIds = new Set(
    lifeList.experiences.map((exp) => exp.experience._id)
  );

  const filteredExperiences = useMemo(() => {
    if (!searchQuery) return [];
    return (allExperiencesData?.getAllExperiences || []).filter((exp) =>
      exp.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allExperiencesData]);

  const handleSelect = (experience, isSelected) => {
    if (isSelected) {
      setSelectedExperiences([...selectedExperiences, experience]);
    } else {
      setSelectedExperiences(
        selectedExperiences.filter((exp) => exp._id !== experience._id)
      );
    }
  };

  const createLifeListExperiences = (experiences) => {
    return experiences.map((experience) => ({
      _id: `temp-${experience._id}`, // Temporary ID for the frontend
      experience,
      list: null,
      associatedShots: [],
      associatedCollages: [],
    }));
  };

  const handleAddExperiences = () => {
    if (selectedExperiences.length > 0) {
      const lifeListExperiences =
        createLifeListExperiences(selectedExperiences);
      navigation.navigate("AddExperiencesOverview", {
        addedExperiences: lifeListExperiences,
        lifeListId: lifeList._id,
      });
    }
  };

  const handleDeselect = () => {
    setSelectedExperiences([]);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderSearchBar
        arrowIcon={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
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
            isSelected={selectedExperiences.some((exp) => exp._id === item._id)}
            onSelect={handleSelect}
            isPreExisting={userExperienceIds.has(item._id)}
          />
        )}
        keyExtractor={(item) => item._id}
      />
      <AddExperiencesBottomContainer
        onAdd={handleAddExperiences}
        onDeselect={handleDeselect}
        isAddDisabled={selectedExperiences.length === 0}
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
