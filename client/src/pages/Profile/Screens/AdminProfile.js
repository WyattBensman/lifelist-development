import React, { useState, useEffect, useRef } from "react";
import { Text, View, Animated, FlatList } from "react-native";
import { headerStyles, iconStyles, layoutStyles } from "../../../styles";
import HeaderMain from "../../../components/Headers/HeaderMain";
import ProfileOverview from "../Components/ProfileOverview";
import CustomProfileNavigator from "../Navigators/CustomProfileNavigator";
import AdminOptionsPopup from "../Popups/AdminOptionsPopup";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useProfile } from "../../../contexts/ProfileContext";
import { useQuery } from "@apollo/client";
import {
  GET_USER_COUNTS,
  GET_COLLAGES_REPOSTS,
} from "../../../utils/queries/userQueries";
import Icon from "../../../components/Icons/Icon";
import {
  saveToAsyncStorage,
  getFromAsyncStorage,
  saveImageToFileSystem,
} from "../../../utils/cacheHelper";

export default function AdminProfile() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [optionsPopupVisible, setOptionsPopupVisible] = useState(false);
  const [followerData, setFollowerData] = useState(null);
  const [collagesData, setCollagesData] = useState([]);
  const [repostsData, setRepostsData] = useState([]);
  const [collagesCursor, setCollagesCursor] = useState(null);
  const [repostsCursor, setRepostsCursor] = useState(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const cacheKeys = {
    collagesMetadata: `collages_metadata_${currentUser}`,
    repostsMetadata: `reposts_metadata_${currentUser}`,
    followerCounts: `follower_counts_${currentUser}`,
    countsTimestamp: `counts_timestamp_${currentUser}`,
  };

  const COUNTS_TTL = 15 * 60 * 1000; // 15 minutes

  const loadCachedData = async () => {
    try {
      const cachedCollages = await getFromAsyncStorage(
        cacheKeys.collagesMetadata
      );
      console.log(`cachedCollages ${cachedCollages}`);

      const cachedReposts = await getFromAsyncStorage(
        cacheKeys.repostsMetadata
      );
      console.log(`cachedReposts ${cachedReposts}`);

      const cachedCounts = await getFromAsyncStorage(cacheKeys.followerCounts);
      const countsTimestamp = await getFromAsyncStorage(
        cacheKeys.countsTimestamp
      );
      console.log(`cachedCounts ${cachedCounts}`);
      console.log(`countsTimestamp ${countsTimestamp}`);

      const countsAreValid =
        cachedCounts &&
        countsTimestamp &&
        Date.now() - countsTimestamp < COUNTS_TTL;

      if (cachedCollages) setCollagesData(cachedCollages);
      if (cachedReposts) setRepostsData(cachedReposts);
      if (countsAreValid) {
        setFollowerData(cachedCounts);
      } else {
        refetchCounts(); // Refetch counts if cached data is invalid or missing
      }

      if (!cachedCollages || !cachedReposts) {
        fetchMore(); // Fetch collages and reposts if missing
      }
    } catch (error) {
      console.error("Error loading cached data:", error);
    }
  };

  useEffect(() => {
    loadCachedData();
  }, []);

  const { data: countsData, refetch: refetchCounts } = useQuery(
    GET_USER_COUNTS,
    {
      variables: { userId: currentUser },
      skip: !!followerData,
      onCompleted: (data) => {
        const { followersCount, followingCount, collagesCount } =
          data.getUserCounts;
        const counts = { followersCount, followingCount, collagesCount };
        setFollowerData(counts);
        saveToAsyncStorage(cacheKeys.followerCounts, counts);
        saveToAsyncStorage(cacheKeys.countsTimestamp, Date.now());
      },
    }
  );

  const { fetchMore } = useQuery(GET_COLLAGES_REPOSTS, {
    variables: {
      userId: currentUser,
      collagesCursor,
      repostsCursor,
      limit: 15,
    },
    onCompleted: async (data) => {
      const { collages, repostedCollages } = data.getCollagesAndReposts;

      const collagesMetadata = await Promise.all(
        collages.collages.map(async (item) => ({
          id: item._id,
          coverImage: await saveImageToFileSystem(
            `collage_cover_${item._id}`,
            item.coverImage
          ),
        }))
      );

      const repostsMetadata = await Promise.all(
        repostedCollages.repostedCollages.map(async (item) => ({
          id: item._id,
          coverImage: await saveImageToFileSystem(
            `repost_cover_${item._id}`,
            item.coverImage
          ),
        }))
      );

      setCollagesData((prev) => [...prev, ...collages.collages]);
      setRepostsData((prev) => [...prev, ...repostedCollages.repostedCollages]);
      setCollagesCursor(collages.nextCursor);
      setRepostsCursor(repostedCollages.nextCursor);

      saveToAsyncStorage(cacheKeys.collagesMetadata, collagesMetadata);
      saveToAsyncStorage(cacheKeys.repostsMetadata, repostsMetadata);
    },
  });

  const fetchMoreCollages = () => {
    if (collagesCursor) {
      fetchMore({
        variables: { collagesCursor, repostsCursor: null, limit: 15 },
      });
    }
  };

  const fetchMoreReposts = () => {
    if (repostsCursor) {
      fetchMore({
        variables: { collagesCursor: null, repostsCursor, limit: 15 },
      });
    }
  };

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: optionsPopupVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [optionsPopupVisible]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const toggleOptionsPopup = () => {
    setOptionsPopupVisible(!optionsPopupVisible);
  };

  if (profileLoading) return <Text>Loading...</Text>;

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderMain
        titleComponent={
          <Text style={headerStyles.headerHeavy}>{profile?.fullName}</Text>
        }
        icon1={
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Icon
              name="ellipsis"
              style={iconStyles.ellipsis}
              weight="bold"
              onPress={toggleOptionsPopup}
            />
          </Animated.View>
        }
      />

      <FlatList
        data={[{ key: "Collages", component: CustomProfileNavigator }]}
        keyExtractor={(item) => item.key}
        renderItem={() => (
          <CustomProfileNavigator
            userId={currentUser}
            isAdmin
            isAdminScreen
            navigation={navigation}
            collages={collagesData}
            repostedCollages={repostsData}
            fetchMoreCollages={fetchMoreCollages}
            fetchMoreReposts={fetchMoreReposts}
          />
        )}
        ListHeaderComponent={() => (
          <ProfileOverview
            profile={profile}
            followerData={followerData}
            userId={currentUser}
            isAdminView
            isAdminScreen
          />
        )}
        style={layoutStyles.wrapper}
      />

      <AdminOptionsPopup
        visible={optionsPopupVisible}
        onRequestClose={toggleOptionsPopup}
        navigation={navigation}
      />
    </View>
  );
}

/*   // Cache fetched data if no cached profile
  useEffect(() => {
    if (data && !cachedProfile) {
      const profile = data.getUserProfileById;

      const updateCachedProfile = async () => {
        try {
          // Save profile picture
          const profilePictureUri = await saveImageToFileSystem(
            cacheKeys.profilePicture,
            profile.profilePicture
          );

          // Cache collages and reposts
          const collageMetadataKeys = [];
          for (let collage of profile.collages) {
            const collageUri = await saveImageToFileSystem(
              `collage_cover_${collage._id}`,
              collage.coverImage
            );
            const key = `collage_metadata_${collage._id}`;
            collageMetadataKeys.push(key);
            saveToAsyncStorage(key, {
              id: collage._id,
              coverImage: collageUri,
            });
          }

          const repostMetadataKeys = [];
          for (let repost of profile.repostedCollages) {
            const repostUri = await saveImageToFileSystem(
              `repost_cover_${repost._id}`,
              repost.coverImage
            );
            const key = `repost_metadata_${repost._id}`;
            repostMetadataKeys.push(key);
            saveToAsyncStorage(key, { id: repost._id, coverImage: repostUri });
          }

          saveToAsyncStorage(
            `collage_metadata_keys_${currentUser}`,
            collageMetadataKeys
          );
          saveToAsyncStorage(
            `repost_metadata_keys_${currentUser}`,
            repostMetadataKeys
          );

          // Update cached profile
          const cachedData = {
            ...profile,
            profilePicture: profilePictureUri,
            collages: profile.collages.map((c, i) => ({
              ...c,
              coverImage: collageMetadataKeys[i],
            })),
            repostedCollages: profile.repostedCollages.map((r, i) => ({
              ...r,
              coverImage: repostMetadataKeys[i],
            })),
          };
          setCachedProfile(cachedData);
          console.log("Cached Profile Updated:", cachedData);

          // Save other profile information to AsyncStorage
          saveToAsyncStorage(cacheKeys.fullName, profile.fullName);
          saveToAsyncStorage(cacheKeys.username, profile.username);
          saveToAsyncStorage(cacheKeys.bio, profile.bio);
        } catch (error) {
          console.error("Error updating profile picture cache:", error);
        }
      };
      updateCachedProfile();
    }
  }, [data, cachedProfile]);

  // Cache counts data if fetched
  useEffect(() => {
    if (countsData && !followerData) {
      const { followersCount, followingCount, collagesCount } =
        countsData.getUserCounts;

      setFollowerData({ followersCount, followingCount, collagesCount });

      saveToAsyncStorage(cacheKeys.followersCount, followersCount);
      saveToAsyncStorage(cacheKeys.followingCount, followingCount);
      saveToAsyncStorage(cacheKeys.collagesCount, collagesCount);
      saveToAsyncStorage(cacheKeys.countsTimestamp, Date.now());
    }
  }, [countsData, followerData]); */

/*   // Load cached data on load
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        // Load static profile data
        const [
          fullName,
          username,
          bio,
          profilePicture,
          followersCount,
          followingCount,
          collagesCount,
          countsTimestamp,
          collageMetadataKeys,
          repostMetadataKeys,
        ] = await Promise.all([
          getFromAsyncStorage(cacheKeys.fullName),
          getFromAsyncStorage(cacheKeys.username),
          getFromAsyncStorage(cacheKeys.bio),
          getImageFromFileSystem(cacheKeys.profilePicture),
          getFromAsyncStorage(cacheKeys.followersCount),
          getFromAsyncStorage(cacheKeys.followingCount),
          getFromAsyncStorage(cacheKeys.collagesCount),
          getFromAsyncStorage(cacheKeys.countsTimestamp),
          getFromAsyncStorage(cacheKeys.collageMetadataKeys),
          getFromAsyncStorage(cacheKeys.repostMetadataKeys),
        ]);

        const countsAreValid =
          followersCount !== null &&
          followingCount !== null &&
          collagesCount !== null &&
          countsTimestamp &&
          Date.now() - countsTimestamp < COUNTS_TTL;

        // Load collages and reposts metadata
        const collages = [];
        const repostedCollages = [];

        for (let key of collageMetadataKeys) {
          const metadata = await getFromAsyncStorage(key);
          const collageUri = await getImageFromFileSystem(
            `collage_cover_${metadata.id}`
          );
          if (metadata && collageUri) {
            collages.push({ ...metadata, coverImage: collageUri });
          }
        }

        for (let key of repostMetadataKeys) {
          const metadata = await getFromAsyncStorage(key);
          const repostUri = await getImageFromFileSystem(
            `repost_cover_${metadata.id}`
          );
          if (metadata && repostUri) {
            repostedCollages.push({ ...metadata, coverImage: repostUri });
          }
        }

        // Log loaded collages and reposts
        console.log("Loaded Collages:", collages);
        console.log("Loaded Reposted Collages:", repostedCollages);

        // Set cached profile if data is present
        if (fullName && username && bio && profilePicture) {
          const cachedData = {
            fullName,
            username,
            bio,
            profilePicture,
            collages,
            repostedCollages,
          };

          setCachedProfile(cachedData);
          console.log("Cached Profile Set:", cachedData);
        }

        // Set follower data or refetch counts
        if (countsAreValid) {
          setFollowerData({ followersCount, followingCount, collagesCount });
        } else {
          refetchCounts();
        }
      } catch (error) {
        console.error("Error loading cached data:", error);
      }
    };

    loadCachedData();
  }, []); */
