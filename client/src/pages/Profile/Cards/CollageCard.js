import { Image, StyleSheet, Dimensions, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../../utils/config";

const screenWidth = Dimensions.get("window").width;
const spacing = 1.5;
const imageWidth = (screenWidth - spacing * 2) / 3; // Adjusted to account for the spacing

export default function CollageCard({ collageId, path, index, collages }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("ViewCollage", { collages, initialIndex: index });
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Image
        source={{ uri: `${BASE_URL}${path}` }}
        style={styles.image}
        resizeMode="cover"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: imageWidth,
    height: imageWidth,
    marginRight: spacing,
    marginBottom: spacing,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
