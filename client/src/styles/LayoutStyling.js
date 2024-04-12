import { StyleSheet } from "react-native";

export const globalStyling = StyleSheet.create({
  container: {
    flex: 1,
  },
  /* RENAME */
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  /* RENAME */
  /* flex: {}, */
  /* RENAME? MAYBE KEEP */
  flexCol: {
    flexDirection: "col",
    justifyContent: "space-between",
    alignItems: "center",
  },
  /* RENAME */
  marginHorizontal: {
    marginHorizontal: 25,
  },
});
