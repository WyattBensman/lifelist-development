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
    marginHorizontal: 16,
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
  marginTopLg: {
    marginTop: 16,
  },
  marginTopMd: {
    marginTop: 8,
  },
  marginTopSm: {
    marginTop: 4,
  },
  marginVertLg: {
    marginVertical: 16,
  },
  /* I need a name for this */
});
