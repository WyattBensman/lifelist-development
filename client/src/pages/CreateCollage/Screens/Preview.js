import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { layoutStyles } from "../../../styles";
import StackHeader from "../../../components/StackHeader";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import { useNavigation, useRoute } from "@react-navigation/native";
import CollagePreview from "../Cards/CollagePreview";

export default function Preview() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedImages, caption } = route.params;

  const handlePost = () => {
    // Implement the logic to handle posting the collage
  };

  return (
    <View style={layoutStyles.container}>
      <StackHeader
        title={"Preview"}
        arrow={<BackArrowIcon navigation={navigation} />}
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
