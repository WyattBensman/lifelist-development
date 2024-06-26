import React, { useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../../../contexts/AuthContext";
import SearchUsersCard from "../Cards/SearchUsersCard";
import { iconStyles, layoutStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import { GET_ALL_USERS } from "../../../utils/queries/userQueries";
import { GET_PRIVACY_GROUP } from "../../../utils/queries/privacyGroupQueries";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import AddUsersBottomContainer from "../Popups/AddUsersBottomContainer";
import { ADD_USERS_TO_PRIVACY_GROUP } from "../../../utils/mutations/privacyGroupsMutations";

export default function AddUsersToPrivacyGroup() {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const privacyGroupId = route.params.privacyGroupId;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [limit] = useState(20); // Set the limit as required
  const [offset] = useState(0); // Set the offset as required

  const {
    data: allUsersData,
    loading: allUsersLoading,
    error: allUsersError,
  } = useQuery(GET_ALL_USERS, {
    variables: { limit, offset },
  });

  const {
    data: privacyGroupData,
    loading: privacyGroupLoading,
    error: privacyGroupError,
  } = useQuery(GET_PRIVACY_GROUP, {
    variables: { privacyGroupId },
  });

  const [addUsersToPrivacyGroup] = useMutation(ADD_USERS_TO_PRIVACY_GROUP, {
    onCompleted: () => {
      navigation.navigate("PrivacyGroup", {
        privacyGroupId: privacyGroupId,
        fromAddUsers: true, // Pass a flag to indicate we came from AddUsersToPrivacyGroup
      });
    },
    onError: (error) => {
      console.error("Error adding users to privacy group:", error);
    },
  });

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return [];
    return (allUsersData?.getAllUsers || []).filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allUsersData]);

  const handleSelect = (user, isSelected) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (isSelected) {
        return [...prevSelectedUsers, user];
      } else {
        return prevSelectedUsers.filter((u) => u._id !== user._id);
      }
    });
  };

  const handleAddUsers = () => {
    if (selectedUsers.length > 0) {
      const userIds = selectedUsers.map((user) => user._id);
      addUsersToPrivacyGroup({
        variables: {
          privacyGroupId,
          userIds,
        },
      });
    }
  };

  const handleDeselect = () => {
    setSelectedUsers([]);
  };

  if (allUsersLoading || privacyGroupLoading) return <Text>Loading...</Text>;
  if (allUsersError) return <Text>Error: {allUsersError.message}</Text>;
  if (privacyGroupError) return <Text>Error: {privacyGroupError.message}</Text>;

  const existingUserIds = new Set(
    privacyGroupData.getPrivacyGroup.users.map((user) => user._id)
  );

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
            isPreExisting={existingUserIds.has(item._id)}
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
