import { StyleSheet, Text, View } from "react-native";

const IconFiller = () => <View style={{ width: 35, height: 35 }} />;

export default function HeaderStack({
  arrow,
  title,
  button1,
  button2,
  hasBorder = true,
}) {
  return (
    <View style={[styles.mainContainer, hasBorder && styles.border]}>
      <View style={styles.contentContainer}>
        {/* Left Container */}
        <View style={styles.sideContainer}>
          {arrow ? arrow : <IconFiller />}
        </View>

        {/* Right Container */}
        <View style={[styles.sideContainer, styles.rightContainer]}>
          {button2 && <View style={styles.iconSpacing}>{button2}</View>}
          {button1 && (
            <View style={[styles.iconSpacing, button2 && styles.iconGap]}>
              {button1}
            </View>
          )}
        </View>

        {/* Title Container - Absolutely positioned */}
        <View style={styles.titleContainer}>
          <Text style={styles.header} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 45,
    paddingTop: 15,
    paddingBottom: 2,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#D4D4D4",
  },
  contentContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  sideContainer: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  rightContainer: {
    justifyContent: "flex-end",
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Helvetica",
    color: "#6AB952",
  },
  iconSpacing: {
    alignItems: "flex-end",
  },
  iconGap: {
    marginLeft: 16,
  },
});
