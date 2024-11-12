import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BlockedUserCard from "../Cards/BlockedUserCard";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { iconStyles, layoutStyles } from "../../../styles";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Icon from "../../../components/Icons/Icon";
import { GET_BLOCKED_USERS } from "../../../utils/queries/userQueries";
import { UNBLOCK_USER } from "../../../utils/mutations/userRelationsMutations";
import {
  getMetaDataFromCache,
  saveMetaDataToCache,
  getImageFromCache,
  saveImageToCache,
} from "../../../utils/cacheHelper";

const CACHE_KEY = "blocked_users";
const CACHE_TTL = 5 * 60; // 5 minutes in seconds

export default function BlockedUsers() {
  const navigation = useNavigation();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [fetchBlockedUsers, { data, loading, error }] =
    useLazyQuery(GET_BLOCKED_USERS);

  // Load cached blocked users metadata on mount
  useEffect(() => {
    const loadCachedData = async () => {
      console.log("Loading cached blocked users...");
      const cachedData = await getMetaDataFromCache(CACHE_KEY);

      if (cachedData) {
        console.log("Cached blocked users found.");
        setBlockedUsers(cachedData);
        setIsLoading(false); // Skip fetching if cache is found
      } else {
        console.log("No cached blocked users found. Fetching from network...");
        fetchBlockedUsers(); // Trigger the query if no cached data
      }
    };

    loadCachedData();
  }, [fetchBlockedUsers]);

  // Handle data fetched from the network
  useEffect(() => {
    if (data) {
      const blockedUsers = data.getBlockedUsers;
      console.log("Blocked users fetched from network:", blockedUsers);

      // Cache profile pictures
      blockedUsers.forEach(async (user) => {
        const imageKey = `blocked_user_${user._id}`;
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
      });

      // Save metadata to the cache
      console.log("Saving blocked users metadata to cache...");
      saveMetaDataToCache(CACHE_KEY, blockedUsers, CACHE_TTL);

      // Update state
      setBlockedUsers(blockedUsers);
      setIsLoading(false);
    }
  }, [data]);

  const [unblockUserMutation] = useMutation(UNBLOCK_USER, {
    onCompleted: (mutationData) => {
      if (mutationData.unblockUser.success) {
        console.log(
          `User ${mutationData.unblockUser.userId} successfully unblocked.`
        );
        // Update the state to remove the unblocked user
        setBlockedUsers((currentUsers) =>
          currentUsers.filter(
            (user) => user._id !== mutationData.unblockUser.userId
          )
        );

        // Also update the cache
        saveMetaDataToCache(
          CACHE_KEY,
          blockedUsers.filter(
            (user) => user._id !== mutationData.unblockUser.userId
          ),
          CACHE_TTL
        );
      }
    },
  });

  const handleUnblock = (userId) => {
    console.log(`Unblocking user: ${userId}`);
    unblockUserMutation({ variables: { userId } });
  };

  const renderBlockedUserCard = ({ item }) => (
    <BlockedUserCard
      userId={item._id}
      fullName={item.fullName}
      username={item.username}
      profilePicture={item.profilePicture}
      onUnblock={handleUnblock}
    />
  );

  if (isLoading || loading)
    return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) {
    console.error("Error loading blocked users:", error.message);
    return <Text>Error loading blocked users: {error.message}</Text>;
  }

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Blocked Users"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
      />
      <FlatList
        data={blockedUsers}
        renderItem={renderBlockedUserCard}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
}

/* import { FlatList, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BlockedUserCard from "../Cards/BlockedUserCard";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { iconStyles, layoutStyles } from "../../../styles";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_BLOCKED_USERS } from "../../../utils/queries/userQueries";
import { UNBLOCK_USER } from "../../../utils/mutations/userRelationsMutations";
import Icon from "../../../components/Icons/Icon";

export default function BlockedUsers() {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_BLOCKED_USERS);
  const [blockedUsers, setBlockedUsers] = useState([]);

  // Initialize the blocked users state when data is fetched
  useEffect(() => {
    if (data) {
      setBlockedUsers(data.getBlockedUsers);
    }
  }, [data]);

  const [unblockUserMutation] = useMutation(UNBLOCK_USER, {
    onCompleted: (data) => {
      if (data.unblockUser.success) {
        // Update the state to remove the unblocked user
        setBlockedUsers((currentUsers) =>
          currentUsers.filter((user) => user !== data.unblockUser.userId)
        );
      }
    },
  });

  const handleUnblock = (userId) => {
    unblockUserMutation({ variables: { userId } });
  };

  const renderBlockedUserCard = ({ item }) => (
    <BlockedUserCard
      userId={item._id}
      fullName={item.fullName}
      username={item.username}
      profilePicture={item.profilePicture}
      onUnblock={handleUnblock}
    />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Blocked Users"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
      />
      <FlatList
        data={blockedUsers}
        renderItem={renderBlockedUserCard}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
}
 */
