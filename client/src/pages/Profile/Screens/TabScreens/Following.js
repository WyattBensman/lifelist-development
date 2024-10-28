import React, { useCallback, useState } from "react";
import { FlatList, Alert, Text, ActivityIndicator } from "react-native";
import UserRelationsCard from "../../Cards/UserRelationsCard";
import { layoutStyles } from "../../../../styles";
import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../../../../contexts/AuthContext";
import { GET_FOLLOWING } from "../../../../utils/queries/userQueries";
import {
  FOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNFOLLOW_USER,
  UNSEND_FOLLOW_REQUEST,
} from "../../../../utils/mutations/userRelationsMutations";
import { useFocusEffect } from "@react-navigation/native";
import {
  getFromCacheStoreWithPagination,
  saveToCacheStoreWithPagination,
} from "../../../../utils/cacheHelper";

export default function Following({ userId, searchQuery }) {
  const { currentUser } = useAuth();
  const [following, setFollowing] = useState([]); // Stores list of following users
  const [page, setPage] = useState(1); // Current page for pagination
  const [loadingMore, setLoadingMore] = useState(false); // Tracks loading state for pagination
  const [hasMore, setHasMore] = useState(true); // Determines if there's more data to load
  const [lastFetchedFollowing, setLastFetchedFollowing] = useState(null); // Last fetch timestamp for current user's following data
  const limit = 20; // Items per page
  const CACHE_TTL = 15 * 60 * 1000; // Cache TTL set to 15 minutes in milliseconds

  // Fetch the following list for the target user
  const {
    loading: loadingFollowing,
    error: errorFollowing,
    fetchMore,
  } = useQuery(GET_FOLLOWING, {
    variables: { userId, limit, offset: 0 },
    onCompleted: (data) => {
      setFollowing(data.getFollowing); // Set initial list of following users
      setHasMore(data.getFollowing.length === limit); // Determine if more data might be available
    },
  });

  // Fetch the following list for the current user to track action statuses
  const {
    data: currentUserFollowingData,
    refetch: refetchCurrentUserFollowing,
  } = useQuery(GET_FOLLOWING, {
    variables: { userId: currentUser },
    onCompleted: () => setLastFetchedFollowing(Date.now()), // Update fetch timestamp
  });

  // Conditional refetch for current user's following data based on cache expiration
  useFocusEffect(
    useCallback(() => {
      const isCacheExpired =
        !lastFetchedFollowing || Date.now() - lastFetchedFollowing > CACHE_TTL;

      if (isCacheExpired) {
        refetchCurrentUserFollowing();
      }
    }, [refetchCurrentUserFollowing, lastFetchedFollowing])
  );

  // Mutations for managing follow/unfollow actions
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequest] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequest] = useMutation(UNSEND_FOLLOW_REQUEST);

  // Handle follow/unfollow actions based on user interaction
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
      return action;
    }
  };

  // Load more following users when scrolling to the end of the list
  const loadMoreFollowing = async () => {
    if (!hasMore || loadingMore) return; // Avoid duplicate requests
    setLoadingMore(true);

    const newOffset = page * limit;
    const cacheKey = `following_${userId}`;

    // Check cache for the next page data
    const cachedData = getFromCacheStoreWithPagination(cacheKey, page);
    if (cachedData) {
      setFollowing((prevFollowing) => [...prevFollowing, ...cachedData]); // Append cached data
      setPage((prevPage) => prevPage + 1);
      setLoadingMore(false);
      return;
    }

    // Fetch more data from the server if not cached
    const { data } = await fetchMore({
      variables: { offset: newOffset, limit },
    });

    if (data.getFollowing.length < limit) setHasMore(false); // End of list if fewer items returned than limit
    setFollowing((prevFollowing) => [...prevFollowing, ...data.getFollowing]); // Append new data to list
    saveToCacheStoreWithPagination(
      cacheKey,
      page,
      data.getFollowing,
      CACHE_TTL
    ); // Cache the new data
    setPage((prevPage) => prevPage + 1);
    setLoadingMore(false);
  };

  // Filter following list based on search query input
  const filteredFollowing = following.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render each following item with appropriate follow status
  const renderFollowingItem = ({ item }) => {
    let action = "Follow";
    if (
      currentUserFollowingData?.getFollowing.some(
        (following) => following._id === item._id
      )
    ) {
      action = "Following";
    } else if (item.followRequests.some((req) => req.userId === currentUser)) {
      action = "Requested";
    }

    return (
      <UserRelationsCard
        user={item}
        initialAction={action}
        onActionPress={handleActionPress}
      />
    );
  };

  if (loadingFollowing) return <Text>Loading...</Text>;
  if (errorFollowing) return <Text>Error: {errorFollowing.message}</Text>;

  return (
    <FlatList
      data={filteredFollowing}
      renderItem={renderFollowingItem}
      keyExtractor={(item) => item._id}
      onEndReached={loadMoreFollowing} // Trigger load more when reaching the end
      onEndReachedThreshold={0.5} // Load more when 50% from the bottom
      ListFooterComponent={
        loadingMore ? <ActivityIndicator size="small" color="#0000ff" /> : null
      }
      style={layoutStyles.wrapper}
    />
  );
}
