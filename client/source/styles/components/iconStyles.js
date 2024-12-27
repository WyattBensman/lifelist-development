import { StyleSheet } from "react-native";

const iconStyles = StyleSheet.create({
  iconContainer: {
    backgroundColor: "#252525",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  iconDefaultSize: {
    height: 32,
    width: 32,
  },
  iconLargeSize: {
    height: 36,
    width: 36,
  },
  noBackground: {
    backgroundColor: "transparent",
  },
  iconButtonWithPadding: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
    width: 70,
  },
  iconLabelContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  labelText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
    width: 90,
  },
  disabled: {
    opacity: 0.5,
  },
  dropdownIconContainer: {
    borderRadius: 50,
    padding: 8,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252525",
  },
});

export default iconStyles;
