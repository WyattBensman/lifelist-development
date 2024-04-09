import { StyleSheet } from "react-native";

export const cardStyling = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  descriptionContainer: {
    marginLeft: 10,
  },
  image: {
    height: 45,
    width: 45,
    borderRadius: 4,
  },
  username: {
    fontWeight: "500",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "#b9b9b9",
    width: 225,
  },
  time: {
    fontSize: 12,
    color: "#b9b9b9",
  },
});
