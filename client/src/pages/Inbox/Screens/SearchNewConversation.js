import React, { useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { useAuth } from "../../../contexts/AuthContext";
import { iconStyles, layoutStyles } from "../../../styles";
import HeaderSearchBar from "../../../components/Headers/HeaderSeachBar";
import Icon from "../../../components/Icons/Icon";
import { GET_ALL_USERS } from "../../../utils/queries/userQueries";
import SearchUserCard from "../Cards/SearchUserCard";
import { useNavigationContext } from "../../../contexts/NavigationContext";

export default function SearchNewConversation() {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { setIsTabBarVisible } = useNavigationContext();

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  const { data, loading, error } = useQuery(GET_ALL_USERS);

  const allUsers = data?.getAllUsers || [];

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return [];
    return allUsers.filter((user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allUsers]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const handleUserPress = (user) => {
    navigation.navigate("Conversation", { user });
  };

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
          <SearchUserCard user={item} onPress={() => handleUserPress(item)} />
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
});
