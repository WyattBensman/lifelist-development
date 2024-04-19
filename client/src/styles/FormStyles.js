import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
  formContainer: {
    flex: 1,
    marginVertical: 24,
    marginHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 36,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: "#D4D4D4",
  },
  /* CORRECT USAGE INSTANCES */
  label: {
    marginBottom: 6,
  },
  /* CORRECT USAGE INSTANCES */
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
  flowpageLinkPlaceholder: {
    width: 17.5,
    height: 17.5,
    backgroundColor: "#ddd",
    marginRight: 12,
    borderRadius: 2,
  },
});
