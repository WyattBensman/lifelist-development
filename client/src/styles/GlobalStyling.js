import { StyleSheet } from "react-native";

export const globalStyling = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexCol: {
    flexDirection: "col",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marginHorizontal: {
    marginHorizontal: 25,
  },
});
