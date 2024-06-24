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
    height: 42,
    color: "#ececec",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#252525",
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
