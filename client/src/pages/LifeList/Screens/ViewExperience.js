import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Animated,
  StyleSheet,
} from "react-native";
import { useQuery } from "@apollo/client";
import HeaderStack from "../../../components/Headers/HeaderStack";
import { GET_LIFELIST_EXPERIENCE } from "../../../utils/queries/lifeListQueries";
import { iconStyles, layoutStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import DropdownMenu from "../../../components/Dropdowns/DropdownMenu";
import ViewExperienceCard from "../Cards/ViewExperienceCard";

export default function ViewExperience({ route, navigation }) {
  const { setIsTabBarVisible } = useNavigationContext();
  const { experienceId } = route.params;

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [shots, setShots] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const {
    data,
    loading: queryLoading,
    error,
    fetchMore,
  } = useQuery(GET_LIFELIST_EXPERIENCE, {
    variables: { experienceId, cursor: null, limit: 12 },
    fetchPolicy: "cache-and-network",
  });
  console.log(data.getLifeListExperience.lifeListExperience.associatedShots);

  // Hide the tab bar when this screen is focused
  useEffect(() => {
    setIsTabBarVisible(false);
    return () => setIsTabBarVisible(true);
  }, [setIsTabBarVisible]);

  // Dropdown rotation animation
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: dropdownVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [dropdownVisible]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  // Load more shots (pagination)
  const loadMoreShots = useCallback(async () => {
    if (loading || !hasNextPage) return;

    setLoading(true);
    try {
      const { data: moreData } = await fetchMore({
        variables: { experienceId, cursor: nextCursor, limit: 12 },
      });

      if (moreData?.getLifeListExperience.lifeListExperience) {
        const {
          associatedShots: newShots,
          nextCursor: newCursor,
          hasNextPage: newHasNext,
        } = moreData.getLifeListExperience.lifeListExperience;

        setShots((prev) => [...prev, ...newShots]);
        setNextCursor(newCursor);
        setHasNextPage(newHasNext);
      }
    } catch (error) {
      console.error("[ViewExperience] Error fetching more shots:", error);
    } finally {
      setLoading(false);
    }
  }, [experienceId, nextCursor, hasNextPage, fetchMore, loading]);

  // Load initial shots when data changes
  useEffect(() => {
    if (data?.getLifeListExperience.lifeListExperience) {
      const {
        associatedShots,
        nextCursor: newCursor,
        hasNextPage: newHasNext,
      } = data.getLifeListExperience.lifeListExperience;

      setShots(associatedShots);
      setNextCursor(newCursor);
      setHasNextPage(newHasNext);
    }
  }, [data]);

  if (queryLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const experience = data.getLifeListExperience?.experience || {};
  const dropdownItems = [
    {
      icon: "pencil",
      label: "Manage Shots",
      onPress: () =>
        navigation.navigate("ManageShots", {
          experienceId,
          associatedShots: shots,
        }),
    },
  ];

  const renderShot = ({ item }) => (
    <ViewExperienceCard shot={item} navigation={navigation} />
  );

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={experience.title || "Experience"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Icon
              name="ellipsis"
              style={iconStyles.ellipsis}
              weight="bold"
              onPress={() => setDropdownVisible(!dropdownVisible)}
            />
          </Animated.View>
        }
        dropdownVisible={dropdownVisible}
        dropdownContent={<DropdownMenu items={dropdownItems} />}
      />
      <FlatList
        data={shots}
        renderItem={renderShot}
        keyExtractor={(item) => item._id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        onEndReached={loadMoreShots}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
    marginHorizontal: 0,
  },
});
