import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { iconStyles, layoutStyles } from "../../../styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import CollagePreview from "../Cards/CollagePreview";
import HeaderStack from "../../../components/Headers/HeaderStack";
import Icon from "../../../components/Icons/Icon";

export default function Preview() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedImages, caption } = route.params;

  const handlePost = () => {
    // Implement the logic to handle posting the collage
  };

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        title={"Preview"}
        arrow={
          <Icon
            name="chevron.backward"
            onPress={() => navigation.goBack()}
            style={iconStyles.backArrow}
            weight="semibold"
          />
        }
        button1={
          <Pressable onPress={handlePost}>
            <Text style={styles.postText}>Post</Text>
          </Pressable>
        }
      />
      <CollagePreview images={selectedImages} caption={caption} />
    </View>
  );
}

const styles = StyleSheet.create({
  postText: {
    color: "#6AB952",
    fontWeight: "500",
  },
});
