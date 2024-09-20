import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Collage from "./Collage";
import Icon from "../../../components/Icons/Icon";
import { iconStyles, layoutStyles } from "../../../styles";

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
    const newContentHeight = screenHeight - headerHeight - navigationBarHeight;
    setContentHeight(newContentHeight);
  };

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const renderCollage = useCallback(
    ({ item }) => (
      <View style={[styles.collageContainer, { height: contentHeight }]}>
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
        style={styles.flatList} // Ensure FlatList covers the remaining space
      />
    </View>
  );
}

const styles = StyleSheet.create({
  collageContainer: {
    width: "100%", // Ensure it fills the width
  },
  flatList: {
    flex: 1, // Ensure FlatList takes the full remaining space
  },
});
