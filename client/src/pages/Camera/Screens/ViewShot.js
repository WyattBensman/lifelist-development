import React from "react";
import { View, Image, StyleSheet, Pressable, Text } from "react-native";
import Modal from "react-native-modal";
import { useNavigation, useRoute } from "@react-navigation/native";

const baseURL = "http://localhost:3001";

export default function ViewShot() {
  const route = useRoute();
  const { imageUrl } = route.params;
  const navigation = useNavigation();

  return (
    <Modal
      isVisible={true}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modal}
      onBackdropPress={() => navigation.goBack()}
    >
      <View style={styles.container}>
        <Pressable style={{ zIndex: 1 }} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Image source={{ uri: `${baseURL}${imageUrl}` }} style={styles.image} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    position: "absolute",
    top: 40,
    left: 20,
  },
  image: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
});
