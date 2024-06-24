import React, { useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { useAuth } from "../../../contexts/AuthContext";
import SearchUsersCard from "../Cards/SearchUsersCard";
import { iconStyles, layoutStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import { GET_ALL_USERS } from "../../../utils/queries/userQueries";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import AddUsersBottomContainer from "../Popups/AddUsersBottomContainer";

export default function AddUsersToPrivacyGroup() {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [limit] = useState(20); // Set the limit as required
  const [offset] = useState(0); // Set the offset as required

  const {
    data: allUsersData,
    loading,
    error,
  } = useQuery(GET_ALL_USERS, {
    variables: { limit, offset },
  });

  console.log(allUsersData);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return [];
    return (allUsersData?.getAllUsers || []).filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
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
      navigation.navigate("PrivacyGroup", {
        addedUsers: selectedUsers,
      });
    }
  };

  const handleDeselect = () => {
    setSelectedUsers([]);
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
          Start typing to search for users
        </Text>
      )}
      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => (
          <SearchUsersCard
            user={item}
            isSelected={selectedUsers.some((u) => u._id === item._id)}
            onSelect={(isSelected) => handleSelect(item, isSelected)}
          />
        )}
        keyExtractor={(item) => item._id}
      />
      <AddUsersBottomContainer
        onAdd={handleAddUsers}
        onDeselect={handleDeselect}
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
