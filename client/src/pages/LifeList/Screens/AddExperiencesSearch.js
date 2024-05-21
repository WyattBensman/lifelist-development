import React, { useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { useAuth } from "../../../contexts/AuthContext";
import SearchItemCard from "../Cards/SearchItemCard";
import { layoutStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import AddExperiencesBottomContainer from "../Components/AddExperiencesBottomContainer";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import { GET_ALL_EXPERIENCES } from "../../../utils/queries/experienceQueries";

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
    const lifeListExperiences = createLifeListExperiences(selectedExperiences);
    navigation.navigate("AddExperiencesOverview", {
      addedExperiences: lifeListExperiences,
      lifeListId: lifeList._id,
    });
  };

  const handleDeselect = () => {
    setSelectedExperiences([]);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderSearchBar
        arrowIcon={<BackArrowIcon navigation={navigation} />}
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

/* import React, { useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../../../contexts/AuthContext";
import SearchItemCard from "../Cards/SearchItemCard";
import { layoutStyles } from "../../../styles";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import AddExperiencesBottomContainer from "../Components/AddExperiencesBottomContainer";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import { GET_ALL_EXPERIENCES } from "../../../utils/queries/experienceQueries";
import { ADD_EXPERIENCES_TO_LIFELIST } from "../../../utils/mutations";
import { GET_USER_PROFILE } from "../../../utils/queries/userQueries";

export default function AddExperiencesSearch() {
  const { currentUser, updateCurrentUser } = useAuth();
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

  // Fetch user's profile for refetching after mutation
  const { refetch: refetchUserProfile } = useQuery(GET_USER_PROFILE, {
    variables: { userId: currentUser._id },
    skip: true, // Skip the initial fetch
  });

  const [addExperiencesToLifeList] = useMutation(ADD_EXPERIENCES_TO_LIFELIST);

  useFocusEffect(
    useCallback(() => {
      refetchLifeList();
    }, [refetchLifeList])
  );

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

  const handleAddExperiences = async () => {
    try {
      const response = await addExperiencesToLifeList({
        variables: {
          lifeListId: lifeList._id,
          experienceIds: selectedExperiences.map((exp) => exp._id),
        },
      });

      if (response.data.addExperiencesToLifeList.success) {
        const updatedUser = await refetchUserProfile(); // Fetch updated user data
        updateCurrentUser(updatedUser.data.getUserProfileById); // Update current user in AuthContext

        navigation.navigate("AddExperiencesOverview", {
          addedExperiences: selectedExperiences,
          lifeListId: lifeList._id,
        });
      } else {
        console.error(
          "Failed to add experiences:",
          response.data.addExperiencesToLifeList.message
        );
      }
    } catch (error) {
      console.error("Error adding experiences:", error);
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
        arrowIcon={<BackArrowIcon navigation={navigation} />}
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
 */
