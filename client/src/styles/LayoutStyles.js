import { StyleSheet } from "react-native";

export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  containerTab: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 1,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 25,
  },
  marginContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
  flexCol: {
    flexDirection: "col",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 2,
  },
  /* I need a name for this */
});
