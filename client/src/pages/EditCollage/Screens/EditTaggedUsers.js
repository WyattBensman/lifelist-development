import React, { useState, useMemo, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { layoutStyles, iconStyles } from "../../../styles";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import SearchUserCard from "../../CreateCollage/Cards/SearchUserCard";
import { GET_ALL_USERS } from "../../../utils/queries/userQueries";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { useCreateCollageContext } from "../../../contexts/CreateCollageContext";

export default function EditTaggedUsers() {
  const navigation = useNavigation();
  const { setIsTabBarVisible } = useNavigationContext();
  const { collage, updateCollage } = useCreateCollageContext(); // Access collage context
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [hasModified, setHasModified] = useState(false); // Track modifications
  const { data: allUsersData, loading, error } = useQuery(GET_ALL_USERS);

  console.log(collage.taggedUsers);

  // Initialize selectedUsers from collage.taggedUsers once
  useEffect(() => {
    setSelectedUsers([...collage.taggedUsers]); // Spread to avoid shared reference issues
  }, [collage.taggedUsers]);

  // Hide the tab bar when this page is focused
  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  // Memoize the filtered users to optimize performance
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return [];
    return (allUsersData?.getAllUsers || []).filter(
      (user) =>
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allUsersData]);

  // Toggle user selection
  const handleSelect = (user) => {
    const isSelected = selectedUsers.some((u) => u._id === user._id);
    let updatedUsers;

    if (isSelected) {
      // Remove user if already selected
      updatedUsers = selectedUsers.filter((u) => u._id !== user._id);
    } else {
      // Add user if not already selected
      updatedUsers = [...selectedUsers, user];
    }

    setSelectedUsers(updatedUsers);

    // Determine if the selection is different from the context
    const hasChanges =
      updatedUsers.length !== collage.taggedUsers.length ||
      !updatedUsers.every((user) =>
        collage.taggedUsers.some((taggedUser) => taggedUser._id === user._id)
      );
    setHasModified(hasChanges);
  };

  // Save tagged users to the context and navigate back
  const handleSaveTaggedUsers = () => {
    if (hasModified) {
      updateCollage({ taggedUsers: selectedUsers });
    }
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
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        icon1={
          <Pressable onPress={handleSaveTaggedUsers}>
            <Text
              style={[
                styles.saveButtonText,
                hasModified && styles.saveButtonTextActive, // Active only if modified
              ]}
            >
              Save
            </Text>
          </Pressable>
        }
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={() => {}}
        isSearchFocused={isSearchFocused}
        onSearchFocusChange={setIsSearchFocused}
        hideIconsOnFocus={false}
      />
      <FlatList
        data={searchQuery === "" ? selectedUsers : filteredUsers}
        renderItem={({ item }) => (
          <SearchUserCard
            user={item}
            isSelected={selectedUsers.some((u) => u._id === item._id)}
            onCheckboxToggle={() => handleSelect(item)} // Pass the user directly
          />
        )}
        keyExtractor={(item) => item._id}
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
  saveButtonText: {
    color: "#696969",
    fontWeight: "600",
  },
  saveButtonTextActive: {
    color: "#6AB952",
  },
});
