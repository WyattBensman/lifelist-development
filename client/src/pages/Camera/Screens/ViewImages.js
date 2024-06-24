import React from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import ViewShot from "./ViewShot";
import { layoutStyles } from "../../../styles";

const { width } = Dimensions.get("window");

export default function ViewImages() {
  const route = useRoute();
  const { images, initialIndex } = route.params; // Ensure images and initialIndex are passed as params

  return (
    <View style={layoutStyles.wrapper}>
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <ViewShot imageUrl={item.url} date={item.date} time={item.time} />
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        initialScrollIndex={initialIndex}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
