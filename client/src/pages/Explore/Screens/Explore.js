import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useLazyQuery } from "@apollo/client";
import ExploreHeader from "../../../components/Headers/ExploreHeader";
import ExploreNavigator from "../Navigators/ExploreNavigator";
import SearchUserCard from "../Cards/SearchUserCard";
import RecommendedProfileCard from "../Cards/RecommendedProfileCard";
import RecommendedCollageCard from "../Cards/RecommendedCollageCard";
import { layoutStyles } from "../../../styles";
import {
  GET_RECOMMENDED_PROFILES,
  GET_RECOMMENDED_COLLAGES,
  GET_ALL_USERS,
} from "../../../utils/queries/index";
import {
  saveMetadataToCache,
  getMetadataFromCache,
} from "../../../utils/newCacheHelper";

const screenWidth = Dimensions.get("window").width;
const collageWidth = (screenWidth - 38) / 2;
const collageHeight = collageWidth * 1.5;

const SEARCH_CACHE_KEY = "explore_search_cache";
const RECENTLY_SEEN_PROFILES = "recently_seen_profiles";
const RECENTLY_SEEN_COLLAGES = "recently_seen_collages";
const MAX_CACHE_SIZE = 24;
const MAX_RECENTLY_SEEN = 10;

export default function Explore({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false); // Refresh state

  // Users search state
  const [users, setUsers] = useState([]);
  const [userCursor, setUserCursor] = useState(null);
  const [userHasNextPage, setUserHasNextPage] = useState(true);
  const [cachedUsers, setCachedUsers] = useState([]);

  // Recommended Profiles State
  const [profiles, setProfiles] = useState([]);
  const [profileCursor, setProfileCursor] = useState(null);
  const [profileHasNextPage, setProfileHasNextPage] = useState(true);
  const [recentlySeenProfiles, setRecentlySeenProfiles] = useState([]);

  // Recommended Collages State
  const [collages, setCollages] = useState([]);
  const [collageCursor, setCollageCursor] = useState(null);
  const [collageHasNextPage, setCollageHasNextPage] = useState(true);
  const [recentlySeenCollages, setRecentlySeenCollages] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      const cachedData = await getMetadataFromCache(SEARCH_CACHE_KEY);
      const recentlySeen = await getMetadataFromCache(RECENTLY_SEEN_PROFILES);

      if (cachedData) setCachedUsers(cachedData);
      if (recentlySeen) setRecentlySeenProfiles(recentlySeen);
    };

    loadInitialData();
  }, []);

  const cacheVisitedProfile = async (profile) => {
    const updatedCache = [
      profile,
      ...cachedUsers.filter((u) => u._id !== profile._id),
    ];
    const limitedCache = updatedCache.slice(0, MAX_CACHE_SIZE);

    setCachedUsers(limitedCache);
    await saveMetadataToCache(SEARCH_CACHE_KEY, limitedCache);
  };

  const handleProfileView = async (profile) => {
    navigation.navigate("ProfileStack", {
      screen: "Profile",
      params: { userId: profile._id },
    });

    const updatedRecentlySeen = [
      profile._id,
      ...recentlySeenProfiles.filter((id) => id !== profile._id),
    ].slice(0, MAX_RECENTLY_SEEN);

    setRecentlySeenProfiles(updatedRecentlySeen);
    await saveMetadataToCache(RECENTLY_SEEN_PROFILES, updatedRecentlySeen);
  };

  const [loadUsers, { loading: userLoading }] = useLazyQuery(GET_ALL_USERS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.getAllUsers) {
        const { users: newUsers, hasNextPage, nextCursor } = data.getAllUsers;

        setUsers((prevUsers) => {
          const userMap = new Map();
          [...prevUsers, ...newUsers].forEach((user) =>
            userMap.set(user.user._id, user)
          );
          return Array.from(userMap.values());
        });
        setUserHasNextPage(hasNextPage);
        setUserCursor(nextCursor);
      }
    },
    onError: (error) => {
      console.error("Error fetching users:", error);
    },
  });

  const [loadProfiles, { loading: profileLoading }] = useLazyQuery(
    GET_RECOMMENDED_PROFILES,
    {
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        if (data?.getRecommendedProfiles) {
          const {
            profiles: newProfiles,
            hasNextPage,
            nextCursor,
          } = data.getRecommendedProfiles;

          setProfiles((prevProfiles) => {
            const profileMap = new Map();
            [...prevProfiles, ...newProfiles].forEach((profile) =>
              profileMap.set(profile._id, profile)
            );
            return Array.from(profileMap.values());
          });
          setProfileHasNextPage(hasNextPage);
          setProfileCursor(nextCursor);
        }
      },
      onError: (error) => {
        console.error("Error fetching recommended profiles:", error);
      },
    }
  );

  const [loadCollages, { loading: collageLoading }] = useLazyQuery(
    GET_RECOMMENDED_COLLAGES,
    {
      fetchPolicy: "network-only",
      onCompleted: async (data) => {
        if (data?.getRecommendedCollages) {
          const {
            collages: newCollages,
            hasNextPage,
            nextCursor,
          } = data.getRecommendedCollages;

          setCollages((prevCollages) => {
            const collageMap = new Map();
            [...prevCollages, ...newCollages].forEach((collage) =>
              collageMap.set(collage._id, collage)
            );
            return Array.from(collageMap.values());
          });

          // Reset recentlySeenCollages before updating with new collages
          setRecentlySeenCollages([]);
          await saveMetadataToCache(RECENTLY_SEEN_COLLAGES, []);

          // Add collages to recently seen and cache
          const newCollageIds = newCollages.map((collage) =>
            collage._id.toString()
          );
          setRecentlySeenCollages(newCollageIds);
          await saveMetadataToCache(RECENTLY_SEEN_COLLAGES, newCollageIds);

          setCollageHasNextPage(hasNextPage);
          setCollageCursor(nextCursor);
        }
      },
      onError: (error) => {
        console.error("Error fetching recommended collages:", error);
      },
    }
  );

  // Debounced Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        loadUsers({ variables: { searchQuery, limit: 10, cursor: null } });
      } else if (searchQuery.trim().length <= 1) {
        setUsers([]); // Clear users if search query is too short
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchMoreUsers = () => {
    if (userHasNextPage && !userLoading) {
      loadUsers({ variables: { searchQuery, limit: 10, cursor: userCursor } });
    }
  };

  const fetchMoreProfiles = () => {
    if (profileHasNextPage && !profileLoading) {
      loadProfiles({
        variables: { cursor: profileCursor, limit: 10, recentlySeenProfiles },
      });
    }
  };

  const fetchMoreCollages = () => {
    if (collageHasNextPage && !collageLoading) {
      loadCollages({
        variables: {
          cursor: collageCursor,
          limit: 10,
          recentlySeen: recentlySeenCollages,
        },
      });
    }
  };

  const handleSearchFocusChange = (isFocused) => {
    setIsSearchFocused(isFocused);
    if (!isFocused) {
      setSearchQuery("");
      setUsers([]);
    }
  };

  useEffect(() => {
    loadProfiles({
      variables: {
        cursor: null,
        limit: 10,
        recentlySeen: recentlySeenProfiles,
      },
    });
    loadCollages({
      variables: {
        cursor: null,
        limit: 10,
        recentlySeen: recentlySeenCollages,
      },
    });
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      // Clear old profiles and collages before refreshing
      setProfiles([]);
      setCollages([]);
      setProfileCursor(null);
      setCollageCursor(null);

      // Re-fetch recommended profiles
      await loadProfiles({
        variables: {
          cursor: null,
          limit: 10,
          recentlySeen: recentlySeenProfiles, // Pass recentlySeen to exclude last seen profiles
        },
      });

      // Re-fetch recommended collages
      await loadCollages({
        variables: {
          cursor: null,
          limit: 10,
          recentlySeen: recentlySeenCollages, // Pass recentlySeen to exclude last seen collages
        },
      });

      // Clear recentlySeenCollages after the query to reset for the next refresh
      setRecentlySeenCollages([]);
      await saveMetadataToCache(RECENTLY_SEEN_COLLAGES, []);
    } finally {
      setIsRefreshing(false); // Reset refreshing state
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <ExploreHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFocusChange={handleSearchFocusChange}
        isSearchFocused={isSearchFocused}
        onBackPress={() => {
          setIsSearchFocused(false);
          setSearchQuery("");
          setUsers([]);
        }}
      />
      {isSearchFocused ? (
        <>
          <ExploreNavigator activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "All" || activeTab === "Users" ? (
            <View style={styles.searchResultsContainer}>
              {searchQuery.trim() === "" && cachedUsers.length > 0 ? (
                <FlatList
                  data={cachedUsers}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={({ item }) => (
                    <SearchUserCard
                      user={item}
                      navigation={navigation}
                      cacheVisitedProfile={cacheVisitedProfile}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                />
              ) : userLoading && users.length === 0 ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <FlatList
                  data={users}
                  keyExtractor={(item) => item._id.toString()}
                  renderItem={({ item }) => (
                    <SearchUserCard
                      user={item}
                      navigation={navigation}
                      cacheVisitedProfile={cacheVisitedProfile}
                    />
                  )}
                  onEndReached={fetchMoreUsers}
                  onEndReachedThreshold={0.8}
                  ListFooterComponent={
                    userLoading && (
                      <ActivityIndicator size="small" color="#fff" />
                    )
                  }
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          ) : (
            <Text style={styles.noResultsText}>
              Communities feature is under development.
            </Text>
          )}
        </>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          <Text style={styles.sectionTitle}>Recommended Profiles</Text>
          {profileLoading && profiles.length === 0 ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <FlatList
              data={profiles}
              horizontal
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <RecommendedProfileCard
                  user={item}
                  onPress={() => handleProfileView(item)}
                />
              )}
              onEndReached={fetchMoreProfiles}
              onEndReachedThreshold={0.8}
              showsHorizontalScrollIndicator={false}
            />
          )}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
            Recommended Collages
          </Text>
          {collageLoading && collages.length === 0 ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <FlatList
              data={collages}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <RecommendedCollageCard
                  collage={item}
                  navigation={navigation}
                  collageWidth={collageWidth}
                  collageHeight={collageHeight}
                />
              )}
              numColumns={2}
              columnWrapperStyle={styles.rowWrapper}
              showsVerticalScrollIndicator={false}
              onEndReached={fetchMoreCollages}
              onEndReachedThreshold={0.8}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  searchResultsContainer: {
    flex: 1,
  },
  noResultsText: {
    marginTop: 16,
    color: "#fff",
    textAlign: "center",
  },
  rowWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
