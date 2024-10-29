import React, { useState, useCallback } from "react";
import { FlatList, Alert, Text } from "react-native";
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
import { useFocusEffect } from "@react-navigation/native";
import {
  getPaginatedFromCacheStore,
  savePaginatedToCacheStore,
} from "../../../../utils/cacheHelper";

export default function Followers({ userId, searchQuery }) {
  const { currentUser } = useAuth();
  const [lastSeenId, setLastSeenId] = useState(null);
  const [followersDataCache, setFollowersDataCache] = useState([]);

  const {
    data: followersData,
    loading: loadingFollowers,
    error: errorFollowers,
    fetchMore,
  } = useQuery(GET_FOLLOWERS, {
    variables: { userId, limit: 20, lastSeenId },
  });

  useFocusEffect(
    useCallback(() => {
      const cachedData = getPaginatedFromCacheStore(`followers_${userId}`, 1);
      if (cachedData) {
        setFollowersDataCache(cachedData);
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
      return action; // Return the current action if there's an error
    }
  };

  const loadMoreFollowers = async () => {
    if (followersData?.getFollowers.length > 0) {
      const lastId =
        followersData.getFollowers[followersData.getFollowers.length - 1]._id;
      setLastSeenId(lastId);
      const moreData = await fetchMore({
        variables: { lastSeenId: lastId, limit: 20 },
      });
      setFollowersDataCache((prev) => [...prev, ...moreData.data.getFollowers]);
      savePaginatedToCacheStore(
        `followers_${userId}`,
        1,
        followersDataCache,
        15 * 60
      );
    }
  };

  const filteredFollowers = followersDataCache.filter((follower) =>
    follower.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFollowerItem = ({ item }) => {
    let action = "Follow";
    if (followersDataCache.some((follower) => follower._id === item._id)) {
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
      onEndReached={loadMoreFollowers}
      onEndReachedThreshold={0.5}
      style={layoutStyles.wrapper}
    />
  );
}
