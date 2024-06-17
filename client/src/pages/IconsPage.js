import { StyleSheet, Text, View } from "react-native";
import { iconStyles, layoutStyles } from "../styles";
import HeaderStack from "../components/Headers/HeaderStack";
import BackArrowIcon from "../icons/Universal/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { SymbolView } from "expo-symbols";

export default function IconsPage() {
  const navigation = useNavigation();

  return (
    <View style={layoutStyles.wrapper}>
      <HeaderStack
        arrow={<BackArrowIcon navigation={navigation} />}
        title={"Icons Page"}
      />
      <View style={styles.container}>
        <Text>Collage Icons</Text>
        <SymbolView />
      </View>
      <View style={styles.container}>
        <Text>Header Icons</Text>
        <View style={styles.iconContainer}>
          <SymbolView name="bell" style={styles.bell} tintColor={"#000"} />
        </View>
        <SymbolView
          name="ellipsis.circle"
          style={iconStyles.ellipsisCircle}
          tintColor={"#000"}
        />
      </View>
      <View style={styles.container}>
        <Text>Dropdown Icons</Text>
      </View>
      <View style={styles.container}>
        <Text>Popup Icons</Text>
      </View>
      <View style={styles.container}>
        <Text>List Type Icons</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  iconContainer: {
    backgroundColor: "#f3f3f3", // light gray background
    borderRadius: 50, // make it circular
    padding: 10, // adjust padding as needed
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  // Header Icons
  bell: {
    height: 20,
    width: 18.62,
  },
});
