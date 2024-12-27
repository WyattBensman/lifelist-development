import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
  // === Search Bar === //

  searchContainer: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
    paddingHorizontal: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 4,
    color: "#fff",
    fontSize: 16,
  },

  // === Text Input === //
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    color: "#fff",
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#252525",
  },
});

export default formStyles;
