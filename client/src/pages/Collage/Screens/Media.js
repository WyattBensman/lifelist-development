import { Pressable, StyleSheet, Text, View } from "react-native";
import { layoutStyles } from "../../../styles";
import { useNavigation } from "@react-navigation/native";

export default function Media() {
  const navigation = useNavigation();

  return (
    <View style={layoutStyles.container}>
      <Pressable onPress={navigation.navigate("ViewCollage")}>
        <Text>View Collage</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  image1: {
    height: 278,
    width: 278,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 2,
    marginRight: 2,
    backgroundColor: "#000000",
  },
});
