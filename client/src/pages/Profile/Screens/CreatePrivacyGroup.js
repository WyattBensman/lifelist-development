import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from "@apollo/client";
import { layoutStyles, iconStyles } from "../../../styles";
import HeaderStack from "../../../components/Headers/HeaderStack";
import SearchUsersCard from "../Cards/SearchUsersCard";
import { GET_ALL_USERS } from "../../../utils/queries/userQueries";
import { CREATE_PRIVACY_GROUP } from "../../../utils/mutations/index";
import Icon from "../../../components/Icons/Icon";
import { useAuth } from "../../../contexts/AuthContext"; // Import AuthContext
import SearchBarStandard from "../../../components/SearchBars/SearchBarStandard";

export default function CreatePrivacyGroup() {
  const navigation = useNavigation();
  const { currentUser, updateCurrentUser } = useAuth(); // Get currentUser and updateCurrentUser
  const [title, setTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [limit] = useState(20); // Set the limit as required
  const [offset] = useState(0); // Set the offset as required

  const {
    data: allUsersData,
    loading,
    error,
  } = useQuery(GET_ALL_USERS, {
    variables: { limit, offset },
  });

  const [createPrivacyGroup] = useMutation(CREATE_PRIVACY_GROUP);

  useEffect(() => {
    if (title && selectedUsers.length > 0) {
      setChangesMade(true);
    } else {
      setChangesMade(false);
    }
  }, [title, selectedUsers]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return [];
    return (allUsersData?.getAllUsers || []).filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allUsersData]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const handleSelect = (user, isSelected) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (isSelected) {
        return [...prevSelectedUsers, user];
      } else {
        return prevSelectedUsers.filter((u) => u._id !== user._id);
      }
    });
  };

  const saveChanges = async () => {
    try {
      const { data } = await createPrivacyGroup({
        variables: {
          groupName: title,
          userIds: selectedUsers.map((user) => user._id),
        },
      });

      // Update the currentUser's privacyGroups in the AuthContext
      updateCurrentUser({
        ...currentUser,
        privacyGroups: [...currentUser.privacyGroups, data.createPrivacyGroup],
      });

      console.log("Privacy Group created:", data.createPrivacyGroup);

      navigation.navigate("PrivacyGroups"); // Navigate to the PrivacyGroups
    } catch (error) {
      console.error("Error creating privacy group:", error);
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title="New Privacy Group"
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Pressable
            onPress={saveChanges}
            disabled={!changesMade}
            style={[
              styles.createButtonContainer,
              changesMade && styles.createButtonActiveContainer,
            ]}
          >
            <Text
              style={[
                styles.createButtonText,
                changesMade && styles.createButtonActiveText,
              ]}
            >
              Create
            </Text>
          </Pressable>
        }
      />
      <View style={styles.topContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
            }}
          />
        </View>
      </View>
      <View style={{ marginHorizontal: 12 }}>
        <Text style={{ color: "#fff", fontWeight: "500", marginBottom: 6 }}>
          Add Users
        </Text>
        <SearchBarStandard
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={() => {}}
          onFocusChange={setIsSearchFocused}
        />
      </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    margin: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    width: 72,
    color: "#ffffff",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    color: "#ececec",
    height: 42,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#252525",
  },
  createButtonContainer: {
    backgroundColor: "#252525",
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 12,
  },
  createButtonText: {
    color: "#696969",
    fontWeight: "600",
  },
  createButtonActiveContainer: {
    backgroundColor: "#6AB95230",
  },
  createButtonActiveText: {
    color: "#6AB952",
    fontWeight: "500",
  },
  instructionText: {
    textAlign: "center",
    marginTop: 20,
    color: "#d4d4d4",
  },
});
