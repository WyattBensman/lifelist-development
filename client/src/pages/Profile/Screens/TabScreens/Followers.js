import React, { useEffect, useState } from "react";
import { FlatList, Alert, Text, View, ActivityIndicator } from "react-native";
import UserRelationsCard from "../../Cards/UserRelationsCard";
import { layoutStyles } from "../../../../styles";
import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../../../../contexts/AuthContext";
import { GET_FOLLOWERS } from "../../../../utils/queries/userQueries";
import {
  FOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNFOLLOW_USER,
  UNSEND_FOLLOW_REQUEST,
} from "../../../../utils/mutations/userRelationsMutations";
import {
  getMetaDataFromCache,
  saveMetaDataToCache,
} from "../../../../utils/cacheHelper";

const PAGE_SIZE = 20;

export default function Followers({ userId, searchQuery }) {
  const { currentUser } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Load cached followers metadata on mount
  useEffect(() => {
    const loadCachedData = async () => {
      console.log("Loading cached followers...");
      const cachedData = await getMetaDataFromCache(`followers_${userId}`);
      if (cachedData) {
        console.log("Cached followers data found.");
        setFollowers(cachedData.users);
        setCursor(cachedData.nextCursor);
        setHasMore(cachedData.hasNextPage);
      } else {
        console.log("No cached followers data found.");
      }
    };
    loadCachedData();
  }, [userId]);

  const { data, loading, error, fetchMore } = useQuery(GET_FOLLOWERS, {
    variables: { userId, cursor, limit: PAGE_SIZE },
    fetchPolicy: "cache-and-network",
    onCompleted: async (fetchedData) => {
      console.log("Followers data fetched from network:", fetchedData);

      const { users, nextCursor, hasNextPage } = fetchedData.getFollowers;

      // Save followers metadata to cache
      console.log("Saving followers metadata to cache...");
      await saveMetaDataToCache(`followers_${userId}`, {
        users,
        nextCursor,
        hasNextPage,
      });

      // Remove duplicates and update state
      const newUniqueFollowers = users.filter(
        (newFollower) =>
          !followers.some(
            (existing) => existing.user._id === newFollower.user._id
          )
      );
      setFollowers((prev) => [...prev, ...newUniqueFollowers]);
      setCursor(nextCursor);
      setHasMore(hasNextPage);
    },
  });

  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequest] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequest] = useMutation(UNSEND_FOLLOW_REQUEST);

  const handleActionPress = async (userId, action, isPrivate) => {
    try {
      if (action === "Follow") {
        if (isPrivate) {
          const { data } = await sendFollowRequest({
            variables: { userIdToFollow: userId },
          });
          Alert.alert("Request Sent", data.sendFollowRequest.message);
          return "Requested";
        } else {
          const { data } = await followUser({
            variables: { userIdToFollow: userId },
          });
          Alert.alert("Follow", data.followUser.message);
          return "Following";
        }
      } else if (action === "Following") {
        const { data } = await unfollowUser({
          variables: { userIdToUnfollow: userId },
        });
        Alert.alert("Unfollow", data.unfollowUser.message);
        return "Follow";
      } else if (action === "Requested") {
        const { data } = await unsendFollowRequest({
          variables: { userIdToUnfollow: userId },
        });
        Alert.alert("Request Withdrawn", data.unsendFollowRequest.message);
        return "Follow";
      }
    } catch (error) {
      Alert.alert("Action Error", error.message);
      return action; // Return the current action if there's an error
    }
  };

  const loadMore = async () => {
    if (hasMore && !loading) {
      console.log("Loading more followers...");
      await fetchMore({
        variables: { userId, cursor, limit: PAGE_SIZE },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          console.log("Fetched additional followers from network.");
          return {
            getFollowers: {
              ...fetchMoreResult.getFollowers,
              users: [
                ...prev.getFollowers.users,
                ...fetchMoreResult.getFollowers.users,
              ],
            },
          };
        },
      });
    }
  };

  const filteredFollowers = followers.filter((follower) =>
    follower.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFollowerItem = ({ item }) => {
    return (
      <UserRelationsCard
        user={item.user}
        initialAction={item.relationshipStatus}
        onActionPress={handleActionPress}
        isPrivate={item.isPrivate}
      />
    );
  };

  if (loading && !followers.length)
    return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) {
    console.log("Error loading followers:", error.message);
    return <Text>Error loading followers: {error.message}</Text>;
  }

  return (
    <FlatList
      data={filteredFollowers}
      renderItem={renderFollowerItem}
      keyExtractor={(item) => item.user._id.toString()}
      style={layoutStyles.wrapper}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
    />
  );
}
