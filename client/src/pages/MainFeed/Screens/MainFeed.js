import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import LifeListLogo from "../Icons/LifeListLogo";
import HeaderMain from "../../../components/Headers/HeaderMain";
import { useAuth } from "../../../contexts/AuthContext";
import IconHeader from "../../../icons/IconHeader";
import Collage from "../../Collage/Screens/Collage";
import { useLazyQuery } from "@apollo/client";
import { GET_MAIN_FEED } from "../../../utils/queries";
import { useNavigation } from "@react-navigation/native";
import { iconStyles } from "../../../styles";

const { height: screenHeight } = Dimensions.get("window");

export default function MainFeed() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [collages, setCollages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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
      fetchMainFeed({ variables: { userId: currentUser._id, page: 1 } });
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

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchMore({
        variables: {
          userId: currentUser._id,
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
        <Collage collageId={item._id} />
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

  if (!currentUser) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (loading && page === 1) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.wrapper}>
      <View onLayout={onHeaderLayout}>
        <HeaderMain
          titleComponent={<LifeListLogo />}
          icon1={
            <IconHeader
              name="plus.square.on.square"
              onPress={() => navigation.navigate("CreateCollage")}
              style={iconStyles.createCollage}
            />
          }
          icon2={<IconHeader name="bell" style={iconStyles.bell} />}
        />
      </View>
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
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && page > 1 ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null
        }
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FBFBFE",
  },
  flatListContent: {
    flexGrow: 1,
  },
});
