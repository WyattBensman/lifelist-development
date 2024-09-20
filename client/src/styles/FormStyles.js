import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
  formContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#252525",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#252525",
  },
  label: {
    fontWeight: "500",
    marginBottom: 4,
    color: "#fff",
  },
  inputSpacer: {
    marginTop: 16,
  },
  smallText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
