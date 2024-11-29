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
  GET_COLLAGES_REPOSTS,
  GET_USER_COUNTS,
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
  console.log(`Profile: ${profile}`);
  console.log(profile);

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

      const cachedReposts = await getFromAsyncStorage(
        cacheKeys.repostsMetadata
      );

      const cachedCounts = await getFromAsyncStorage(cacheKeys.followerCounts);

      const countsTimestamp = await getFromAsyncStorage(
        cacheKeys.countsTimestamp
      );

      const countsAreValid =
        cachedCounts &&
        countsTimestamp &&
        Date.now() - countsTimestamp < COUNTS_TTL;

      if (cachedCollages) {
        setCollagesData(cachedCollages);
      }
      if (cachedReposts) setRepostsData(cachedReposts);
      if (countsAreValid) {
        setFollowerData(cachedCounts);
      } else {
        refetchCounts();
      }

      if (!cachedCollages || !cachedReposts) {
        refetchCollagesReposts();
      }
    } catch (error) {
      console.error("Error loading cached data:", error);
    }
  };

  useEffect(() => {
    loadCachedData();
  }, []);

  // Query for follower counts
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

  // Query for collages and reposts
  const {
    data: collagesRepostsData,
    fetchMore: fetchMoreCollagesReposts,
    refetch: refetchCollagesReposts,
  } = useQuery(GET_COLLAGES_REPOSTS, {
    variables: {
      userId: currentUser,
      collagesCursor,
      repostsCursor,
      limit: 15,
    },
    skip: !!(collagesData.length && repostsData.length),
    onCompleted: (data) => {
      const { collages, repostedCollages } = data.getCollagesAndReposts;
      console.log(collages.items);
      console.log(repostedCollages.items);

      // Temporarily update state with raw data (without caching images)
      setCollagesData(collages.items);
      setRepostsData(repostedCollages.items);

      setCollagesCursor(collages.nextCursor);
      setRepostsCursor(repostedCollages.nextCursor);
    },
  });

  // Handle image caching in a separate effect
  useEffect(() => {
    if (collagesRepostsData) {
      const { collages, repostedCollages } =
        collagesRepostsData.getCollagesAndReposts;

      const cacheImages = async () => {
        try {
          const collagesMetadata = await Promise.all(
            collages.items.map(async (item) => ({
              _id: item._id,
              coverImage: await saveImageToFileSystem(
                `collage_cover_${item._id}`,
                item.coverImage
              ),
            }))
          );

          const repostsMetadata = await Promise.all(
            repostedCollages.items.map(async (item) => ({
              _id: item._id,
              coverImage: await saveImageToFileSystem(
                `repost_cover_${item._id}`,
                item.coverImage
              ),
            }))
          );

          // Update state and cache
          setCollagesData(collagesMetadata);
          setRepostsData(repostsMetadata);

          saveToAsyncStorage(cacheKeys.collagesMetadata, collagesMetadata);
          saveToAsyncStorage(cacheKeys.repostsMetadata, repostsMetadata);
        } catch (error) {
          console.error("Error caching images:", error);
        }
      };

      cacheImages();
    }
  }, [collagesRepostsData]);

  const fetchMoreCollages = () => {
    if (collagesCursor) {
      fetchMoreCollagesReposts({
        variables: {
          userId: currentUser,
          collagesCursor,
          repostsCursor: null,
          limit: 15,
        },
      });
    }
  };

  const fetchMoreReposts = () => {
    if (repostsCursor) {
      fetchMoreCollagesReposts({
        variables: {
          userId: currentUser,
          collagesCursor: null,
          repostsCursor,
          limit: 15,
        },
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
