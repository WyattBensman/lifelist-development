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
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: "#D4D4D4",
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "500",
    marginBottom: 4,
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
