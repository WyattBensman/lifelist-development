import React, { useCallback, useState } from "react";
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

const PAGE_LIMIT = 20; // Number of followers to load per page

export default function Followers({ userId, searchQuery }) {
  const { currentUser } = useAuth();
  const [offset, setOffset] = useState(0);
  const [allFollowers, setAllFollowers] = useState([]);

  const {
    data: followersData,
    loading: loadingFollowers,
    error: errorFollowers,
    fetchMore,
    refetch,
  } = useQuery(GET_FOLLOWERS, {
    variables: { userId, searchQuery, limit: PAGE_LIMIT, offset: 0 },
    onCompleted: (data) => setAllFollowers(data.getFollowers),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
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

  const loadMoreFollowers = async () => {
    try {
      const { data } = await fetchMore({
        variables: { offset: offset + PAGE_LIMIT },
      });
      setAllFollowers((prev) => [...prev, ...data.getFollowers]);
      setOffset((prevOffset) => prevOffset + PAGE_LIMIT);
    } catch (error) {
      console.error("Error loading more followers:", error);
    }
  };

  const renderFollowerItem = ({ item }) => (
    <UserRelationsCard
      user={item}
      initialAction={item.followStatus} // Follow status directly from the backend
      onActionPress={handleActionPress}
    />
  );

  if (loadingFollowers && allFollowers.length === 0)
    return <Text>Loading...</Text>;
  if (errorFollowers) return <Text>Error: {errorFollowers.message}</Text>;

  return (
    <FlatList
      data={allFollowers}
      renderItem={renderFollowerItem}
      keyExtractor={(item) => item._id}
      style={layoutStyles.wrapper}
      onEndReached={loadMoreFollowers}
      onEndReachedThreshold={0.5}
    />
  );
}
