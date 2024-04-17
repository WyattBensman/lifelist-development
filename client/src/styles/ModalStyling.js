import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 25,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
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
    fontSize: 16,
    marginBottom: 15,
  },
  buttonClose: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 1,
  },
  /* CORRECT USAGE INSTANCES */
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    width: 300,
    borderRadius: 8,
    borderColor: "#D4D4D4",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  fullWidth: {
    width: "100%",
  },
});
