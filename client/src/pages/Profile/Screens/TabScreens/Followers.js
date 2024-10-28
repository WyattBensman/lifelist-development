import React, { useCallback, useState, useEffect } from "react";
import { FlatList, Alert, Text, View, ActivityIndicator } from "react-native";
import UserRelationsCard from "../../Cards/UserRelationsCard";
import { layoutStyles } from "../../../../styles";
import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  GET_FOLLOWERS,
  GET_FOLLOWING,
} from "../../../../utils/queries/userQueries";
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

export default function Followers({ userId, searchQuery }) {
  const { currentUser } = useAuth();
  const [followers, setFollowers] = useState([]); // List of followers
  const [page, setPage] = useState(1); // Current page for pagination
  const [loadingMore, setLoadingMore] = useState(false); // Tracks loading state for more data
  const [hasMore, setHasMore] = useState(true); // Determines if there’s more data to fetch
  const [lastFetchedFollowing, setLastFetchedFollowing] = useState(null); // Last fetch timestamp for following data
  const limit = 20; // Items per page
  const CACHE_TTL = 15 * 60 * 1000; // Cache TTL set to 15 minutes in milliseconds

  // Fetch following data for current user and track last fetch time
  const { data: followingData, refetch: refetchFollowing } = useQuery(
    GET_FOLLOWING,
    {
      variables: { userId: currentUser },
      onCompleted: () => setLastFetchedFollowing(Date.now()), // Update fetch timestamp on completion
    }
  );

  // Initial fetch of followers data with pagination
  const {
    loading: loadingFollowers,
    error: errorFollowers,
    fetchMore,
  } = useQuery(GET_FOLLOWERS, {
    variables: { userId, limit, offset: 0 },
    onCompleted: (data) => {
      setFollowers(data.getFollowers); // Populate followers list with initial data
      setHasMore(data.getFollowers.length === limit); // Set if there's more data available
    },
  });

  // Conditional refetch of following data based on cache expiration
  useFocusEffect(
    useCallback(() => {
      const isCacheExpired =
        !lastFetchedFollowing || Date.now() - lastFetchedFollowing > CACHE_TTL;

      if (isCacheExpired) {
        refetchFollowing(); // Refetch if cache has expired
      }
    }, [refetchFollowing, lastFetchedFollowing])
  );

  // Mutations for follow, unfollow, send, and cancel follow request actions
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequest] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequest] = useMutation(UNSEND_FOLLOW_REQUEST);

  // Handles follow/unfollow actions based on user interaction
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

  // Loads more followers when scrolling to the end of the list
  const loadMoreFollowers = async () => {
    if (!hasMore || loadingMore) return; // Avoid additional calls if no more data
    setLoadingMore(true);

    const newOffset = page * limit;
    const cacheKey = `followers_${userId}`;

    // Check if the next page data is available in cache
    const cachedData = getFromCacheStoreWithPagination(cacheKey, page);
    if (cachedData) {
      setFollowers((prevFollowers) => [...prevFollowers, ...cachedData]); // Append cached data
      setPage((prevPage) => prevPage + 1);
      setLoadingMore(false);
      return;
    }

    // Fetch new data from server if not in cache
    const { data } = await fetchMore({
      variables: { offset: newOffset, limit },
    });

    if (data.getFollowers.length < limit) setHasMore(false); // No more data if response is less than limit
    setFollowers((prevFollowers) => [...prevFollowers, ...data.getFollowers]); // Append new data
    saveToCacheStoreWithPagination(
      cacheKey,
      page,
      data.getFollowers,
      CACHE_TTL
    ); // Cache the new data
    setPage((prevPage) => prevPage + 1);
    setLoadingMore(false);
  };

  // Filters followers based on the search query
  const filteredFollowers = followers.filter((follower) =>
    follower.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Renders each follower with the appropriate action status (Follow, Following, Requested)
  const renderFollowerItem = ({ item }) => {
    let action = "Follow";
    if (
      followingData?.getFollowing.some(
        (following) => following._id === item._id
      )
    ) {
      action = "Following";
    } else if (item.followRequests.some((req) => req._id === currentUser)) {
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

  if (loadingFollowers) return <Text>Loading...</Text>;
  if (errorFollowers) return <Text>Error: {errorFollowers.message}</Text>;

  return (
    <FlatList
      data={filteredFollowers}
      renderItem={renderFollowerItem}
      keyExtractor={(item) => item._id}
      onEndReached={loadMoreFollowers} // Trigger load more when reaching the end
      onEndReachedThreshold={0.5} // Load more when 50% from the bottom
      ListFooterComponent={
        loadingMore ? <ActivityIndicator size="small" color="#0000ff" /> : null
      }
      style={layoutStyles.wrapper}
    />
  );
}
