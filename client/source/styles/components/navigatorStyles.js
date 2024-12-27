import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const navigatorStyles = StyleSheet.create({
  // Base Navigator Styles
  navigatorWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
    paddingBottom: 12,
  },
  navigatorButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    backgroundColor: "#1C1C1C",
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeNavigatorButton: {
    backgroundColor: "#6AB95230",
    borderWidth: 1,
    borderColor: "#6AB95250",
  },
  navigatorText: {
    color: "#696969",
    fontWeight: "500",
  },
  activeNavigatorText: {
    color: "#6AB952",
    fontWeight: "500",
  },

  // Screen Styles
  screenContainer: {
    flexDirection: "row",
    width: width * 2, // Default width for 2 tabs
    flex: 1,
  },
  screen: {
    width: width,
    flex: 1,
  },

  // Custom Styles for Specific Navigators
  exploreNavigatorWrapper: {
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1C",
  },
  profileNavigatorWrapper: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  editProfileNavigatorWrapper: {
    justifyContent: "center",
    marginVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1c1c1c",
  },
  editProfileNavigatorButton: {
    width: "26%",
  },
  userRelationsNavigatorWrapper: {
    justifyContent: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1c1c1c",
  },
  userRelationsNavigatorButton: {
    width: "40%",
  },
  listViewNavigatorWrapper: {
    marginVertical: 12,
  },
  listViewNavigatorButton: {
    marginRight: 12,
  },
});
