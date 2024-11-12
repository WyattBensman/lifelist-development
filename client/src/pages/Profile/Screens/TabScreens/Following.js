import React, { useEffect, useState } from "react";
import { FlatList, Alert, Text, View, ActivityIndicator } from "react-native";
import UserRelationsCard from "../../Cards/UserRelationsCard";
import { layoutStyles } from "../../../../styles";
import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../../../../contexts/AuthContext";
import { GET_FOLLOWING } from "../../../../utils/queries/userQueries";
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  SEND_FOLLOW_REQUEST,
  UNSEND_FOLLOW_REQUEST,
} from "../../../../utils/mutations/userRelationsMutations";
import {
  getMetaDataFromCache,
  saveMetaDataToCache,
  getImageFromCache,
  saveImageToCache,
} from "../../../../utils/cacheHelper";

const PAGE_SIZE = 20;

export default function Following({ userId, searchQuery }) {
  const { currentUser } = useAuth();
  const [followingList, setFollowingList] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Load cached following metadata on mount
  useEffect(() => {
    const loadCachedData = async () => {
      console.log("Loading cached following data...");
      const cachedData = await getMetaDataFromCache(`following_${userId}`);
      if (cachedData) {
        console.log("Cached following data found.");
        setFollowingList(cachedData.users);
        setCursor(cachedData.nextCursor);
        setHasMore(cachedData.hasNextPage);
      } else {
        console.log("No cached following data found.");
      }
    };
    loadCachedData();
  }, [userId]);

  const { data, loading, error, fetchMore } = useQuery(GET_FOLLOWING, {
    variables: { userId, cursor, limit: PAGE_SIZE },
    fetchPolicy: "cache-and-network",
    onCompleted: async (fetchedData) => {
      console.log("Following data fetched from network:", fetchedData);

      const { users, nextCursor, hasNextPage } = fetchedData.getFollowing;

      // Save following metadata to cache
      console.log("Saving following metadata to cache...");
      await saveMetaDataToCache(`following_${userId}`, {
        users,
        nextCursor,
        hasNextPage,
      });

      // Cache profile pictures
      for (const item of users) {
        const user = item.user; // Access the nested user object
        const imageKey = `profile_picture_${user._id}`;
        console.log(`PROFILE PICTURE FOLLOWERS: ${user.profilePicture}`);

        const cachedImageUri = await getImageFromCache(
          imageKey,
          user.profilePicture
        );

        if (!cachedImageUri) {
          console.log(`Caching profile picture for user: ${user._id}`);
          await saveImageToCache(imageKey, user.profilePicture);
        } else {
          console.log(`Profile picture already cached for user: ${user._id}`);
        }
      }

      // Remove duplicates and update state
      const newUniqueFollowing = users.filter(
        (newUser) =>
          !followingList.some(
            (existing) => existing.user._id === newUser.user._id
          )
      );
      setFollowingList((prev) => [...prev, ...newUniqueFollowing]);
      setCursor(nextCursor);
      setHasMore(hasNextPage);
    },
  });

  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [sendFollowRequest] = useMutation(SEND_FOLLOW_REQUEST);
  const [unsendFollowRequest] = useMutation(UNSEND_FOLLOW_REQUEST);

  const handleActionPress = async (targetUserId, action, isPrivate) => {
    try {
      if (action === "Follow") {
        if (isPrivate) {
          const { data } = await sendFollowRequest({
            variables: { userIdToFollow: targetUserId },
          });
          Alert.alert("Request Sent", data.sendFollowRequest.message);
          return "Requested";
        } else {
          const { data } = await followUser({
            variables: { userIdToFollow: targetUserId },
          });
          Alert.alert("Follow", data.followUser.message);
          return "Following";
        }
      } else if (action === "Following") {
        const { data } = await unfollowUser({
          variables: { userIdToUnfollow: targetUserId },
        });
        Alert.alert("Unfollow", data.unfollowUser.message);
        return "Follow";
      } else if (action === "Requested") {
        const { data } = await unsendFollowRequest({
          variables: { userIdToUnfollow: targetUserId },
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
      console.log("Loading more following data...");
      await fetchMore({
        variables: { userId, cursor, limit: PAGE_SIZE },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          console.log("Fetched additional following from network.");
          return {
            getFollowing: {
              ...fetchMoreResult.getFollowing,
              users: [
                ...prev.getFollowing.users,
                ...fetchMoreResult.getFollowing.users,
              ],
            },
          };
        },
      });
    }
  };

  const filteredFollowing = followingList.filter((following) =>
    following.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFollowingItem = ({ item }) => (
    <UserRelationsCard
      user={item.user}
      initialAction={item.relationshipStatus}
      onActionPress={handleActionPress}
      isPrivate={item.isPrivate}
    />
  );

  if (loading && !followingList.length)
    return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) {
    console.log("Error loading following:", error.message);
    return <Text>Error loading following: {error.message}</Text>;
  }

  return (
    <FlatList
      data={filteredFollowing}
      renderItem={renderFollowingItem}
      keyExtractor={(item) => item.user._id.toString()}
      style={layoutStyles.wrapper}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
    />
  );
}
