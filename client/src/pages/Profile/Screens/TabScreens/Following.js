import React, { useState, useCallback } from "react";
import { FlatList, Alert, Text } from "react-native";
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
  getPaginatedFromCacheStore,
  savePaginatedToCacheStore,
} from "../../../../utils/cacheHelper";

export default function Following({ userId, searchQuery }) {
  const { currentUser } = useAuth();
  const [lastSeenId, setLastSeenId] = useState(null);
  const [followingDataCache, setFollowingDataCache] = useState([]);

  const {
    data: followingData,
    loading: loadingFollowing,
    error: errorFollowing,
    fetchMore,
  } = useQuery(GET_FOLLOWING, {
    variables: { userId, limit: 20, lastSeenId },
  });

  useFocusEffect(
    useCallback(() => {
      const cachedData = getPaginatedFromCacheStore(`following_${userId}`, 1);
      if (cachedData) {
        setFollowingDataCache(cachedData);
      } else {
        // Refetch if there's no cached data
        fetchMore();
      }
    }, [fetchMore, userId])
  );

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
      return action;
    }
  };

  const loadMoreFollowing = async () => {
    if (followingData?.getFollowing.length > 0) {
      const lastId =
        followingData.getFollowing[followingData.getFollowing.length - 1]._id;
      setLastSeenId(lastId);
      const moreData = await fetchMore({
        variables: { lastSeenId: lastId, limit: 20 },
      });
      setFollowingDataCache((prev) => [...prev, ...moreData.data.getFollowing]);
      savePaginatedToCacheStore(
        `following_${userId}`,
        1,
        followingDataCache,
        15 * 60
      );
    }
  };

  const filteredFollowing = followingDataCache.filter((following) =>
    following.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFollowingItem = ({ item }) => {
    let action = "Follow";
    if (followingDataCache.some((following) => following._id === item._id)) {
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

  if (loadingFollowing) return <Text>Loading...</Text>;
  if (errorFollowing) return <Text>Error: {errorFollowing.message}</Text>;

  return (
    <FlatList
      data={filteredFollowing}
      renderItem={renderFollowingItem}
      keyExtractor={(item) => item._id}
      onEndReached={loadMoreFollowing}
      onEndReachedThreshold={0.5}
      style={layoutStyles.wrapper}
    />
  );
}
