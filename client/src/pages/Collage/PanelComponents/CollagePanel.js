import { Text, View, StyleSheet } from "react-native";
import BookmarkOutline from "../Icons/BookmarkOutline";
import RepostIcon from "../Icons/RepostIcon";
import CommentIcon from "../Icons/CommentIcon";
import ParticipantsIcon from "../Icons/ParticipantsIcon";
import { layoutStyles } from "../../../styles";
import { useState } from "react";
import ParticipantsPopup from "../Popups/ParticipantsPopup";
import CommentsPopup from "../Popups/CommentsPopup";

export default function CollagePanel() {
  const [commentsPopupVisible, setCommentsPopupVisible] = useState(false);
  const [participantsPopupVisible, setParticipantsPopupVisible] =
    useState(false);

  const toggleCommentsPopup = () => {
    setCommentsPopupVisible(!commentsPopupVisible);
  };

  const toggleParticipantsPopup = () => {
    setParticipantsPopupVisible(!participantsPopupVisible);
  };

  return (
    <>
      <View style={styles.collagePanel}>
        <View style={layoutStyles.flex}>
          <View style={layoutStyles.flexRow}>
            <View style={styles.panelImage} />
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <Text style={styles.username}>Bella Barr</Text>
              <Text style={styles.location}>Tampa, Florida</Text>
            </View>
          </View>
          <View
            style={[
              layoutStyles.flexRow,
              { alignSelf: "flex-start", marginTop: 4 },
            ]}
          >
            <CommentIcon onPress={toggleCommentsPopup} />
            <RepostIcon />
            <BookmarkOutline />
            <ParticipantsIcon onPress={toggleParticipantsPopup} />
          </View>
        </View>
        <Text style={{ marginTop: 8, color: "#ffffff" }}>
          No way this is the bio. No way this is the bio. No way this is the
          bio. No way this is the bio. No way this is the bio. No way this is
          the bio. No way this is the bio
        </Text>
      </View>
      <ParticipantsPopup
        visible={participantsPopupVisible}
        onRequestClose={toggleParticipantsPopup}
      />
      <CommentsPopup
        visible={commentsPopupVisible}
        onRequestClose={toggleCommentsPopup}
      />
    </>
  );
}

const styles = StyleSheet.create({
  collagePanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 8,
    backgroundColor: "rgba(130, 130, 130, 0.4)",
    borderRadius: 6,
    padding: 12,
    marginHorizontal: 8,
  },
  panelImage: {
    height: 40,
    width: 40,
    backgroundColor: "#919191",
    borderRadius: 4,
    marginRight: 6,
  },
  username: {
    fontWeight: "500",
    marginBottom: 2,
    color: "#ffffff",
  },
  location: {
    fontSize: 12,
    color: "#ffffff",
  },
});
