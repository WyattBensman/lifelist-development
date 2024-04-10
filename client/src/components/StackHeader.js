import { StyleSheet, Text, View } from "react-native";

export default function StackHeader({ arrow, title, button1, button2 }) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.leftContainer}>
          {arrow || <View style={styles.iconContainer} />}
        </View>
        <View style={styles.middleContainer}>
          <Text style={styles.header} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          {button2 && <View style={styles.iconSpacing}>{button2}</View>}
          <View style={styles.iconSpacing}>{button1}</View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 45,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#D4D4D4",
  },
  contentContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContainer: {
    flex: 1,
  },
  middleContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 5,
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 5,
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Helvetica",
    color: "#6AB952",
  },
  iconSpacing: {
    marginLeft: 18,
  },
  iconContainer: {
    width: 35,
    height: 35,
  },
});
