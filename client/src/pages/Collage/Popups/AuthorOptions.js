import { Text, View, StyleSheet, Pressable } from "react-native";
import {
  headerStyles,
  iconStyles,
  layoutStyles,
  popupStyles,
} from "../../../styles";
import IconStatic from "../../../components/Icons/IconStatic";
import BottomPopup from "../../Profile/Popups/BottomPopup";
import { useNavigation } from "@react-navigation/native";
import {
  ARCHIVE_COLLAGE,
  DELETE_COLLAGE,
  UNARCHIVE_COLLAGE,
} from "../../../utils/mutations";
import { useAdminProfile } from "../../../contexts/AdminProfileContext";
import { useMutation } from "@apollo/client";

export default function AuthorOptions({
  visible,
  onRequestClose,
  collageId,
  collageData,
  isArchived,
  handleArchivePress,
}) {
  const navigation = useNavigation();
  const { addCollage, removeCollage } = useAdminProfile();

  // Initialize mutations
  const [archiveCollage] = useMutation(ARCHIVE_COLLAGE);
  const [unarchiveCollage] = useMutation(UNARCHIVE_COLLAGE);
  const [deleteCollage] = useMutation(DELETE_COLLAGE);

  // Handle archive action
  const handleArchive = async () => {
    try {
      if (isArchived) {
        // Unarchive the collage
        const { data } = await unarchiveCollage({ variables: { collageId } });
        if (data?.unarchiveCollage?.success) {
          console.log(data.unarchiveCollage.message);

          // Add the unarchived collage back to the state
          addCollage({
            _id: collageId,
            coverImage: collageData.coverImage,
            createdAt: collageData.createdAt,
          });
        }
      } else {
        // Archive the collage
        const { data } = await archiveCollage({ variables: { collageId } });
        if (data?.archiveCollage?.success) {
          console.log(data.archiveCollage.message);

          // Remove the archived collage from the state
          removeCollage(collageId);
        }
      }

      // Close the popup
      onRequestClose();
    } catch (error) {
      console.error("Error archiving/unarchiving collage:", error.message);
    }
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      const { data } = await deleteCollage({ variables: { collageId } });
      if (data?.deleteCollage?.success) {
        console.log(data.deleteCollage.message);

        // Remove the deleted collage from the state
        removeCollage(collageId);
      }

      // Close the popup
      onRequestClose();
    } catch (error) {
      console.error("Error deleting collage:", error.message);
    }
  };

  return (
    <BottomPopup visible={visible} onRequestClose={onRequestClose} height={484}>
      <View style={popupStyles.popupContainer}>
        <Text style={[headerStyles.headerMedium, styles.text]}>Options</Text>
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={() => {
            onRequestClose(); // Close the popup
            navigation.navigate("CollageStack", {
              screen: "EditMedia",
              params: {
                collageId, // Pass the collage ID
                collageData, // Pass the collage data object
              },
            });
          }}
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic
              name="pencil.and.outline"
              tintColor={"#6AB952"}
              weight={"semibold"}
              style={iconStyles.popupIcon}
            />
            <Text style={[popupStyles.spacer, styles.greenText]}>Edit</Text>
          </View>
          <IconStatic
            name="chevron.forward"
            style={iconStyles.forwardArrow}
            weight={"semibold"}
            tintColor={"#6AB952"}
          />
        </Pressable>

        {/* Archive/Unarchive Option */}
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={handleArchive}
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic
              name={isArchived ? "archivebox.fill" : "archivebox"}
              style={iconStyles.popupIcon}
              tintColor={"#5FC4ED"}
            />
            <Text style={[popupStyles.spacer, styles.blueText]}>
              {isArchived ? "Unarchive" : "Archive"}
            </Text>
          </View>
        </Pressable>

        {/* Delete Option */}
        <Pressable
          style={[popupStyles.cardContainer, layoutStyles.flex]}
          onPress={handleDelete}
        >
          <View style={layoutStyles.flexRow}>
            <IconStatic
              name={"trash"}
              style={iconStyles.popupIcon}
              tintColor={"#FF6347"}
            />
            <Text style={[popupStyles.spacer, styles.redText]}>Delete</Text>
          </View>
        </Pressable>

        <Text
          style={[headerStyles.headerMedium, styles.text, { marginTop: 8 }]}
        >
          Share
        </Text>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="message.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Copy Link</Text>
          </View>
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="message.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Message</Text>
          </View>
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="message.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Instagram</Text>
          </View>
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="message.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Facebook</Text>
          </View>
        </View>
        <View style={[popupStyles.cardContainer, layoutStyles.flex]}>
          <View style={layoutStyles.flexRow}>
            <IconStatic name="message.circle" style={iconStyles.popupIcon} />
            <Text style={[popupStyles.spacer, styles.text]}>Snapchat</Text>
          </View>
        </View>
      </View>
    </BottomPopup>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#ffffff",
  },
  greenText: {
    color: "#6AB952",
    fontWeight: "600",
  },
  blueText: {
    color: "#5FC4ED",
    fontWeight: "600",
  },
  redText: { color: "#FF6347", fontWeight: "600" },
});
