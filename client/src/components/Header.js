import { StyleSheet, View } from "react-native";

const IconFiller = () => <View style={{ width: 35, height: 35 }} />;

export default function Header({ titleComponent, icon1, icon2, icon3 }) {
  return (
    <View style={styles.headerContainer}>
      {/* Title Component on the far left */}
      <View style={styles.leftContainer}>{titleComponent}</View>
      <IconFiller />

      {/* Icons on the right */}
      <View style={styles.iconsContainer}>
        {icon1 && <View style={styles.icon}>{icon1}</View>}
        {icon2 && (
          <View style={[styles.icon, styles.iconSpacing]}>{icon2}</View>
        )}
        {icon3 && (
          <View style={[styles.icon, styles.iconSpacing]}>{icon3}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 45,
    paddingTop: 15,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#D4D4D4",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconSpacing: {
    marginLeft: 16,
  },
});
