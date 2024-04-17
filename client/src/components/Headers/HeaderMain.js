import { StyleSheet, View } from "react-native";
import { layoutStyles } from "../../styles";

const IconFiller = () => <View style={{ width: 35, height: 35 }} />;

export default function HeaderMain({ titleComponent, icon1, icon2, icon3 }) {
  return (
    <View style={[styles.headerContainer, layoutStyles.flex]}>
      {/* Title Component on the far left */}
      <View style={[layoutStyles.flexRowCenter]}>{titleComponent}</View>
      <IconFiller />

      {/* Icons on the right */}
      <View style={layoutStyles.flexRowCenter}>
        {icon1 && <View style={layoutStyles.alignJustifyCenter}>{icon1}</View>}
        {icon2 && (
          <View
            style={[layoutStyles.alignJustifyCenter, layoutStyles.marginLeftMd]}
          >
            {icon2}
          </View>
        )}
        {icon3 && (
          <View
            style={[layoutStyles.alignJustifyCenter, layoutStyles.marginLeftMd]}
          >
            {icon3}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 45,
    paddingTop: 16,
    paddingBottom: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    borderBottomColor: "#D4D4D4",
  },
});
