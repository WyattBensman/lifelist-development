import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
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

const screenWidth = Dimensions.get("window").width;
const collageWidth = (screenWidth - 38) / 2; // Width for each collage
const collageHeight = collageWidth * 1.5; // Height maintaining 3:2 ratio

export default function Explore({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  // Users search state
  const [users, setUsers] = useState([]);
  const [userCursor, setUserCursor] = useState(null);
  const [userHasNextPage, setUserHasNextPage] = useState(true);

  // Recommended Profiles State
  const [profiles, setProfiles] = useState([]);
  const [profileCursor, setProfileCursor] = useState(null);
  const [profileHasNextPage, setProfileHasNextPage] = useState(true);

  // Recommended Collages State
  const [collages, setCollages] = useState([]);
  const [collageCursor, setCollageCursor] = useState(null);
  const [collageHasNextPage, setCollageHasNextPage] = useState(true);

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
              profileMap.set(profile.user._id, profile)
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
      onCompleted: (data) => {
        console.log("HEY");

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

    // Cleanup function
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchMoreUsers = () => {
    if (userHasNextPage && !userLoading) {
      loadUsers({ variables: { searchQuery, limit: 10, cursor: userCursor } });
    }
  };

  const fetchMoreProfiles = () => {
    if (profileHasNextPage && !profileLoading) {
      loadProfiles({ variables: { cursor: profileCursor, limit: 10 } });
    }
  };

  const fetchMoreCollages = () => {
    if (collageHasNextPage && !collageLoading) {
      loadCollages({ variables: { cursor: collageCursor, limit: 10 } });
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
    loadProfiles({ variables: { cursor: null, limit: 10 } });
    loadCollages({ variables: { cursor: null, limit: 10 } });
  }, []);

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
              {userLoading && users.length === 0 ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <FlatList
                  data={users}
                  keyExtractor={(item) => item.user._id.toString()}
                  renderItem={({ item }) => (
                    <SearchUserCard user={item.user} initialAction={null} />
                  )}
                  onEndReached={fetchMoreUsers}
                  onEndReachedThreshold={0.8}
                  ListFooterComponent={
                    userLoading && (
                      <ActivityIndicator size="small" color="#fff" />
                    )
                  }
                  showsHorizontalScrollIndicator={false}
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
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Recommended Profiles</Text>
          {profileLoading && profiles.length === 0 ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <FlatList
              data={profiles}
              horizontal
              keyExtractor={(item) => item.user._id.toString()}
              renderItem={({ item }) => (
                <RecommendedProfileCard
                  user={item.user}
                  navigation={navigation}
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
        </View>
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
    paddingHorizontal: 16,
  },
  noResultsText: {
    marginTop: 16,
    color: "#fff",
    textAlign: "center",
  },
  rowWrapper: {
    justifyContent: "space-between", // Spreads cards to opposite sides
    marginBottom: 16, // Adds spacing between rows
  },
});
