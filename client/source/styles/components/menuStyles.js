import { StyleSheet } from "react-native";

export const menuStyles = StyleSheet.create({
  // PopUp
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1C1C1C",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: "hidden",
  },
  nonDraggableContent: {
    flex: 1,
  },

  // DropDown
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#121212",
    padding: 24,
  },
  dropdownItemContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
  },
  dropdownLabel: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
  },

  // Specific Styles
  popupContainer: {
    margin: 16,
  },
  cardContainer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#252525",
  },
  spacer: {
    marginLeft: 12,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
  header: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  greenText: {
    color: "#6AB952",
    fontWeight: "600",
  },
  blueText: {
    color: "#5FC4ED",
    fontWeight: "600",
  },
  redText: {
    color: "#FF6347",
    fontWeight: "600",
  },
  shareHeader: {
    marginTop: 8,
  },

  // New Styles for Participants Popup
  dynamicPopupContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  draggableHeader: {
    marginHorizontal: 16,
    marginTop: 16,
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#252525",
  },
  dynamicCardContainer: {
    paddingBottom: 8,
  },

  // Input Section for Comments
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#696969",
    backgroundColor: "#1C1C1C",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#252525",
    color: "#fff",
    fontSize: 14,
  },
  postButton: {
    marginLeft: 8,
    paddingVertical: 9,
    paddingHorizontal: 16,
    backgroundColor: "#6AB95230",
    borderRadius: 20,
  },
  postButtonText: {
    color: "#6AB952",
    fontWeight: "600",
  },

  // Empty State Text
  emptyText: {
    color: "#696969",
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
});
