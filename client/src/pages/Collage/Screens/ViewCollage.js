import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Collage from "./Collage";
import Icon from "../../../components/Icons/Icon";

const { height: screenHeight } = Dimensions.get("window");

export default function ViewCollage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { collages, initialIndex } = route.params;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [navigationBarHeight, setNavigationBarHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(screenHeight);

  const onHeaderLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
    calculateContentHeight(height, navigationBarHeight);
  };

  useEffect(() => {
    const tabBarHeight = screenHeight * 0.095;
    setNavigationBarHeight(tabBarHeight);
    calculateContentHeight(headerHeight, tabBarHeight);
  }, [headerHeight]);

  const calculateContentHeight = (headerHeight, navigationBarHeight) => {
    const newContentHeight =
      screenHeight - headerHeight - (navigationBarHeight - 7);
    setContentHeight(newContentHeight);
  };

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const renderCollage = useCallback(
    ({ item }) => (
      <View style={{ height: contentHeight }}>
        <Collage collageId={item._id} isViewCollageScreen={true} />
      </View>
    ),
    [contentHeight]
  );

  return (
    <View style={layoutStyles.wrapper}>
      <View onLayout={onHeaderLayout}>
        <HeaderStack
          arrow={
            <Icon
              name="chevron.backward"
              onPress={() => navigation.goBack()}
              style={iconStyles.backArrow}
              weight="semibold"
            />
          }
          button1={
            <Icon
              name="ellipsis"
              style={iconStyles.ellipsis}
              weight="bold"
              onPress={() => {
                /* handle ellipsis action for the collage */
              }}
            />
          }
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
        onViewableItemsChanged={handleViewableItemsChanged}
        initialScrollIndex={initialIndex}
        getItemLayout={(data, index) => ({
          length: contentHeight,
          offset: contentHeight * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FBFBFE",
  },
});
