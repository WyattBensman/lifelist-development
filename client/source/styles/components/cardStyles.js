import { StyleSheet } from "react-native";

export const cardStylees = StyleSheet.create({
  listItemContainer: {
    backgroundColor: "#1C1C1C",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginTop: 8,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageMd: {
    height: 48,
    width: 48,
    borderRadius: 4,
    backgroundColor: "#252525", // Fallback background color
  },
  placeholder: {
    height: 48,
    width: 48,
    borderRadius: 4,
    backgroundColor: "#252525", // Fallback background color
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  primaryText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#FFFFFF",
  },
  secondaryText: {
    fontSize: 12,
    color: "#696969",
    marginTop: 2,
  },
  actionButtonSpacer: {
    marginRight: 8,
  },
  textContainerSpacer: {
    marginTop: 6,
    marginLeft: 8,
  },
  imageRadius: {
    borderRadius: 4,
  },

  // === Explore Cards === //

  recommendedCardContainer: {
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
    paddingLeft: 10,
    paddingVertical: 10,
    paddingRight: 20,
    marginRight: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  // === Experience Cards === //

  experienceCardContainer: {
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: "#1C1C1C",
  },

  experienceListContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 4,
    marginTop: 4,
    flex: 1,
    padding: 8,
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
  },

  // === Camera Cards === //

  // CameraAlbum
  cameraAlbumCardContainer: {
    marginRight: 8,
    backgroundColor: "#252525", // Fallback background color
  },
  albumImage: {
    width: 150,
    height: 150,
    backgroundColor: "#252525", // Fallback background color
  },

  // Camera Shot
  cameraShotContainer: {
    width: shotWidth,
    height: shotHeight,
    marginBottom: spacing,
    position: "relative",
    backgroundColor: "#252525", // Fallback background color
  },
  shotWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: "#252525", // Fallback background color
  },
  shotImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#252525", // Fallback background color
  },
  overlayBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "#6AB952", // Green border color
  },
  checkbox: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderRadius: 10,
  },

  // Blurred Shot
  blurredShotWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#252525", // Fallback background color
  },
  blurredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)", // Dark overlay with blur
  },
  blurredLoadingText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  blurredTimerText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  blurredReadyText: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    color: "#000",
    padding: 4,
    borderRadius: 4,
    fontWeight: "bold",
  },

  // === Status Colors === //

  experiencedColor: {
    color: "#6AB952",
  },
  wishlistedColor: {
    color: "#5FC4ED",
  },
  experiencedButton: {
    backgroundColor: "#6AB95230",
    borderWidth: 1,
    borderColor: "#6AB95250",
  },
  wishListedButton: {
    backgroundColor: "#5FC4ED30",
    borderWidth: 1,
    borderColor: "#5FC4ED50",
  },

  // === Options and Buttons === //

  optionsContainer: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingLeft: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  optionsButton: {
    borderWidth: 1,
    borderColor: "#696969",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  spacer: {
    marginLeft: 8,
  },

  // === Collage Cards === //

  collageThumbnailContainer: {
    width: imageWidth,
    height: imageWidth,
    marginRight: spacing,
    marginBottom: spacing,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252525", // Fallback background color while loading
  },
  collageThumbnailImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#252525", // Fallback background color
  },
  collageThumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252525", // Fallback background color
  },

  // === Comment Card Styles === //

  commentCardContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
  },
  commentImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: "#252525",
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentText: {
    color: "#FFFFFF",
    marginBottom: 8,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    color: "#696969",
    fontSize: 12,
    marginLeft: 4,
  },

  // === Swipeable Actions === //

  actionsContainer: {
    flexDirection: "row",
  },
  deleteAction: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 85,
  },
  reportAction: {
    backgroundColor: "#1C1C1C",
    justifyContent: "center",
    alignItems: "center",
    width: 85,
  },
});

export default cardStyles;
