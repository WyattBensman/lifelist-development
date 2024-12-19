import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { layoutStyles } from "../../../styles";
import ExploreHeader from "../../../components/Headers/ExploreHeader";
import ExploreNavigator from "../Navigators/ExploreNavigator";
import {
  GET_ALL_USERS,
  GET_RECOMMENDED_PROFILES,
} from "../../../utils/queries/index";
import { useLazyQuery } from "@apollo/client";
import SearchUserCard from "../Cards/SearchUserCard";
import RecommendedProfileCard from "../Cards/RecommendedProfileCard";

export default function ExploreHome({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [users, setUsers] = useState([]);
  const [recommendedProfiles, setRecommendedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [fetchUsers, { data, loading: queryLoading }] = useLazyQuery(
    GET_ALL_USERS,
    {
      fetchPolicy: "network-only",
    }
  );

  const [fetchRecommendedProfiles, { data: recommendedData }] = useLazyQuery(
    GET_RECOMMENDED_PROFILES,
    {
      fetchPolicy: "network-only",
    }
  );

  // Debounce search query changes
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch users with updated search query or pagination
  const fetchUsersData = useCallback(
    async (cursor = null) => {
      setLoading(true);
      try {
        fetchUsers({
          variables: {
            limit: 12,
            cursor,
            searchQuery:
              activeTab === "All" || activeTab === "Users"
                ? debouncedSearchQuery
                : "",
          },
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchQuery, activeTab, fetchUsers]
  );

  // Fetch recommended profiles
  const fetchRecommendedProfilesData = useCallback(
    async (cursor = null) => {
      try {
        fetchRecommendedProfiles({ variables: { cursor, limit: 12 } });
      } catch (error) {
        console.error("Error fetching recommended profiles:", error);
      }
    },
    [fetchRecommendedProfiles]
  );

  // Update users on data change
  useEffect(() => {
    if (data?.getAllUsers) {
      const {
        users: fetchedUsers,
        nextCursor: newCursor,
        hasNextPage: newHasNextPage,
      } = data.getAllUsers;

      setUsers((prevUsers) =>
        newCursor ? [...prevUsers, ...fetchedUsers] : fetchedUsers
      );
      setNextCursor(newCursor);
      setHasNextPage(newHasNextPage);
    }
  }, [data]);

  // Update recommended profiles on data change
  useEffect(() => {
    if (recommendedData?.getRecommendedProfiles) {
      const {
        profiles,
        nextCursor: newCursor,
        hasNextPage: newHasNextPage,
      } = recommendedData.getRecommendedProfiles;

      setRecommendedProfiles((prevProfiles) =>
        newCursor ? [...prevProfiles, ...profiles] : profiles
      );
      setNextCursor(newCursor);
      setHasNextPage(newHasNextPage);
    }
  }, [recommendedData]);

  // Fetch users on debounce query change
  useEffect(() => {
    if (debouncedSearchQuery.length >= 3 || debouncedSearchQuery.length === 0) {
      fetchUsersData();
    }
  }, [debouncedSearchQuery, fetchUsersData]);

  // Load more users on pagination
  const loadMoreUsers = () => {
    if (hasNextPage && !loading) {
      fetchUsersData(nextCursor);
    }
  };

  // Fetch recommended profiles on initial load
  useEffect(() => {
    fetchRecommendedProfilesData();
  }, [fetchRecommendedProfilesData]);

  return (
    <View style={layoutStyles.wrapper}>
      <ExploreHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={() => fetchUsersData()}
        onSearchFocusChange={setIsSearchFocused}
      />
      {isSearchFocused && (
        <ExploreNavigator activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      {!isSearchFocused && (
        <View>
          <Text style={styles.sectionTitle}>Recommended Profiles</Text>
          <FlatList
            data={recommendedProfiles}
            renderItem={({ item }) => (
              <View style={{ marginRight: 8 }}>
                <RecommendedProfileCard user={item} navigation={navigation} />
              </View>
            )}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedList}
          />
        </View>
      )}
      {queryLoading && users.length === 0 ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={activeTab === "Users" || activeTab === "All" ? users : []}
          renderItem={({ item }) => (
            <SearchUserCard user={item.user} navigation={navigation} />
          )}
          keyExtractor={(item) => item.user._id}
          ListFooterComponent={
            loading && hasNextPage ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : null
          }
          onEndReached={loadMoreUsers}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    textAlign: "center",
    color: "#d4d4d4",
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  recommendedList: {
    paddingHorizontal: 16,
  },
});
