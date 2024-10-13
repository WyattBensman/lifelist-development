import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
import HeaderMain from "../../../components/Headers/HeaderMain";
import { useAuth } from "../../../contexts/AuthContext";
import Collage from "../../Collage/Screens/Collage";
import { useLazyQuery } from "@apollo/client";
import { GET_MAIN_FEED } from "../../../utils/queries";
import { useNavigation } from "@react-navigation/native";
import { headerStyles, iconStyles, layoutStyles } from "../../../styles";
import Icon from "../../../components/Icons/Icon";

const { height: screenHeight } = Dimensions.get("window");

export default function MainFeed() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [collages, setCollages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State to track refreshing
  const [headerHeight, setHeaderHeight] = useState(0);
  const [navigationBarHeight, setNavigationBarHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(screenHeight);

  const [fetchMainFeed, { loading, error, data, fetchMore }] = useLazyQuery(
    GET_MAIN_FEED,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    if (currentUser) {
      fetchMainFeed({ variables: { userId: currentUser, page: 1 } });
    }
  }, [currentUser]);

  useEffect(() => {
    if (data) {
      setCollages(data.getMainFeed.collages);
      setHasMore(data.getMainFeed.hasMore);
    }
  }, [data]);

  useEffect(() => {
    const tabBarHeight = screenHeight * 0.095;
    setNavigationBarHeight(tabBarHeight);
    calculateContentHeight(headerHeight, tabBarHeight);
  }, [headerHeight]);

  // Handle the refresh logic
  const handleRefresh = () => {
    setRefreshing(true); // Start the refreshing indicator
    fetchMainFeed({
      variables: { userId: currentUser, page: 1 },
      onCompleted: () => setRefreshing(false), // Stop the refreshing indicator when done
    });
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchMore({
        variables: {
          userId: currentUser,
          page: page + 1,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;
          setPage(page + 1);
          setHasMore(fetchMoreResult.getMainFeed.hasMore);
          return {
            getMainFeed: {
              __typename: previousResult.getMainFeed.__typename,
              collages: [
                ...previousResult.getMainFeed.collages,
                ...fetchMoreResult.getMainFeed.collages,
              ],
              hasMore: fetchMoreResult.getMainFeed.hasMore,
            },
          };
        },
      });
    }
  };

  const renderCollage = useCallback(
    ({ item }) => (
      <View style={{ height: contentHeight }}>
        <Collage collageId={item._id} isMainFeed={true} />
      </View>
    ),
    [contentHeight]
  );

  const onHeaderLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
    calculateContentHeight(height, navigationBarHeight);
  };

  const calculateContentHeight = (headerHeight, navigationBarHeight) => {
    const newContentHeight =
      screenHeight - headerHeight - (navigationBarHeight - 7);
    setContentHeight(newContentHeight);
  };

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={layoutStyles.wrapper}>
      {/* Top Header */}
      <View onLayout={onHeaderLayout}>
        <HeaderMain
          titleComponent={
            <Text style={[headerStyles.headerHeavy]}>LifeList</Text>
          }
          icon1={
            <Icon
              name="plus"
              weight="medium"
              onPress={() => navigation.navigate("CreateCollage")}
              style={iconStyles.createCollagePlus}
            />
          }
          icon2={
            <Icon
              name="bell"
              style={iconStyles.bell}
              weight="medium"
              onPress={() => navigation.navigate("Inbox")}
            />
          }
        />
      </View>

      {/* Main Feed with Pull-to-Refresh */}
      <FlatList
        data={collages}
        renderItem={renderCollage}
        keyExtractor={(item) => item._id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={contentHeight}
        decelerationRate="fast"
        onEndReached={handleLoadMore}
        onEndReachedThreshold={1}
        // Pull-to-refresh control
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff" // Change spinner color
            colors={["#fff"]} // Android only, set to same color as tint
            progressViewOffset={0} // Offset position of the spinner
          />
        }
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flatListContent: {
    flexGrow: 1,
  },
});
