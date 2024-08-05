import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import { BASE_URL } from "../../../../utils/config";
import { iconStyles, layoutStyles } from "../../../../styles";
import Icon from "../../../../components/Icons/Icon";
import * as Sharing from "expo-sharing";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigationContext } from "../../../../contexts/NavigationContext";

const { width } = Dimensions.get("window");
const aspectRatio = 3 / 2;
const imageHeight = width * aspectRatio;

export default function CarouselView({ experienceId, associatedShots }) {
  const { setIsTabBarVisible } = useNavigationContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  useFocusEffect(() => {
    setIsTabBarVisible(false);
  });

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const handleSharePress = async () => {
    const currentShot = associatedShots[currentIndex].shot;
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(`${BASE_URL}${currentShot.image}`);
    } else {
      alert("Sharing is not available on this device");
    }
  };

  return (
    <View style={layoutStyles.wrapper}>
      <View style={{ height: imageHeight }}>
        <FlatList
          data={associatedShots}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <Image
                source={{ uri: `${BASE_URL}${item.shot.image}` }}
                style={styles.image}
              />
            </View>
          )}
          keyExtractor={(item) => item.shot._id.toString()}
          horizontal
          pagingEnabled
          onViewableItemsChanged={handleViewableItemsChanged}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
          initialScrollIndex={currentIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>
      <View style={styles.bottomContainer}>
        <Pressable style={styles.iconButton} onPress={handleSharePress}>
          <Icon name="paperplane" style={iconStyles.shareIcon} weight="bold" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  bottomContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    width: "100%",
    backgroundColor: "#121212",
    marginBottom: 72,
  },
  iconButton: {
    backgroundColor: "#252525",
    borderRadius: 50,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
