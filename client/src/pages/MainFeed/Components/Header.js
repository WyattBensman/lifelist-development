import { Image, StyleSheet, Text, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.logo}>LifeList</Text>
        <View style={styles.btnContainer}>
          <Text>Here!</Text>
          <Text>Here!</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 50,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#B9B9B9",
  },
  contentContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
  },
});
