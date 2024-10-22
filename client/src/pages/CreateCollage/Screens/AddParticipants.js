import React, { useState, useMemo, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { layoutStyles, iconStyles } from "../../../styles";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import SearchUserCard from "../Cards/SearchUserCard";
import AddParticipantsBottomContainer from "../Components/AddParticipantsBottomContainer";
import { GET_ALL_USERS } from "../../../utils/queries/userQueries";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useCollageContext } from "../../../contexts/CollageContext"; // Use collage context

export default function AddParticipants() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const { collage, updateCollage } = useCollageContext(); // Access collage context
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(collage.taggedUsers || []); // Initialize from context
  const { data: allUsersData, loading, error } = useQuery(GET_ALL_USERS);

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  useEffect(() => {
    const hasChanges =
      collage.taggedUsers.length !== selectedUsers.length ||
      !collage.taggedUsers.every((user) =>
        selectedUsers.some((selectedUser) => selectedUser._id === user._id)
      );
    updateCollage({ taggedUsers: selectedUsers }); // Update tagged users in context
  }, [selectedUsers, collage.taggedUsers]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return [];
    return (allUsersData?.getAllUsers || []).filter(
      (user) =>
        (user.fullName?.toLowerCase() ?? "").includes(
          searchQuery.toLowerCase()
        ) ||
        (user.username?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allUsersData]);

  const handleSelect = (user, isSelected) => {
    if (isSelected) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    }
  };

  const handleAddUsers = () => {
    if (selectedUsers.length > 0) {
      updateCollage({ taggedUsers: selectedUsers }); // Ensure context is updated
      navigation.navigate("CollageOverview"); // Navigate back
    }
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
      <FlatList
        data={searchQuery === "" ? selectedUsers : filteredUsers}
        renderItem={({ item }) => (
          <SearchUserCard
            user={item}
            isSelected={selectedUsers.some((u) => u._id === item._id)}
            onCheckboxToggle={handleSelect}
          />
        )}
        keyExtractor={(item) => item._id}
      />
      <AddParticipantsBottomContainer
        onAdd={handleAddUsers}
        isAddDisabled={selectedUsers.length === 0}
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
