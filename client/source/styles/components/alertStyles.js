import { StyleSheet } from "react-native";

export const alertStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalView: {
    margin: 24,
    backgroundColor: "#1c1c1c",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 4,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  modalSubheader: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "400",
    color: "#aaaaaa",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#252525",
    color: "#fff",
    fontSize: 14,
    textAlign: "left",
    marginVertical: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  confirmButton: {
    width: "44%",
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5393530", // Red button
    borderColor: "#E5393550", // Red border
    borderWidth: 1,
  },
  confirmButtonText: {
    textAlign: "center",
    color: "#E53935", // Red text
    fontWeight: "500",
  },
  saveButton: {
    width: "44%",
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6AB95230", // Green button
    borderColor: "#6AB95250", // Green border
    borderWidth: 1,
  },
  saveButtonText: {
    textAlign: "center",
    color: "#6AB952", // Green text
    fontWeight: "500",
  },
  cancelButton: {
    width: "44%",
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#aaaaaa",
    borderWidth: 1,
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#aaaaaa",
    fontWeight: "500",
  },
});
