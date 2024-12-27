import { StyleSheet } from "react-native";

export const displayStyles = StyleSheet.create({
  // Progress Bar Styles
  progressBarContainer: {
    flexDirection: "row",
    width: "97.5%",
    alignSelf: "center",
    height: 3,
    justifyContent: "space-between",
    marginTop: 8,
  },
  progressSegment: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: "#555",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
  },
  activeProgressFill: {
    backgroundColor: "#6AB952", // Highlight current progress bar
  },

  // Touchable Styles
  touchableContainer: {
    height: Dimensions.get("window").width * (3 / 2), // Aspect ratio 3:2
    width: "100%",
  },

  // Image Styles
  imageContainer: {
    width: "100%",
    aspectRatio: 2 / 3,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "97.5%",
    height: "97.5%",
    resizeMode: "cover",
    borderRadius: 4,
  },
});
