import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useLazyQuery } from "@apollo/client";
import { useAuth } from "../../../contexts/AuthContext";
import { GET_MAIN_FEED } from "../../../utils/queries";
import Collage from "../../Collage/Screens/Collage";
import HeaderMain from "../../../components/Headers/HeaderMain";
import Icon from "../../../components/Icons/Icon";
import { headerStyles, iconStyles, layoutStyles } from "../../../styles";

const { height: screenHeight } = Dimensions.get("window");

export default function MainFeed({ route }) {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [collages, setCollages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [navigationBarHeight, setNavigationBarHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(screenHeight);

  const [fetchMainFeed, { loading, error, data, fetchMore }] = useLazyQuery(
    GET_MAIN_FEED,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  // Fetch the initial data when component is mounted
  useEffect(() => {
    if (currentUser) {
      fetchMainFeed({ variables: { userId: currentUser, page: 1 } });
    }
  }, [currentUser]);

  // When data is fetched, update collages and hasMore state
  useEffect(() => {
    if (data) {
      setCollages(data.getMainFeed.collages);
      setHasMore(data.getMainFeed.hasMore);
    }
  }, [data]);

  // Adjust content height when header or navigation bar height changes
  useEffect(() => {
    const tabBarHeight = screenHeight * 0.095;
    setNavigationBarHeight(tabBarHeight);
    calculateContentHeight(headerHeight, tabBarHeight);
  }, [headerHeight]);

  // Handle refresh logic for pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchMainFeed({
      variables: { userId: currentUser, page: 1 },
      onCompleted: () => setRefreshing(false),
    });
  };

  // Handle loading more items when reaching the end of the list
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchMore({
        variables: { userId: currentUser, page: page + 1 },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          setPage(page + 1);
          setHasMore(fetchMoreResult.getMainFeed.hasMore);
          return {
            getMainFeed: {
              __typename: prevResult.getMainFeed.__typename,
              collages: [
                ...prevResult.getMainFeed.collages,
                ...fetchMoreResult.getMainFeed.collages,
              ],
              hasMore: fetchMoreResult.getMainFeed.hasMore,
            },
          };
        },
      });
    }
  };

  // Refresh the feed when navigating back from collage creation
  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        handleRefresh(); // Trigger a refresh when coming back
        navigation.setParams({ refresh: false }); // Reset the refresh flag
      }
    }, [route.params?.refresh])
  );

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
          titleText={"LifeList"}
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
              name="rectangle.portrait.on.rectangle.portrait.angled"
              style={{ width: 17.5 }}
              weight="bold"
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
            colors={["#fff"]}
            progressViewOffset={0}
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
